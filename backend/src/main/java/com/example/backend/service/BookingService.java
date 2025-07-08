package com.example.backend.service;

import com.example.backend.enums.Role;
import com.example.backend.model.dto.GymSchedule;
import com.example.backend.model.dto.request.BookingRequest;
import com.example.backend.model.dto.request.TimeSlotRequest;
import com.example.backend.model.dto.response.BookingsResponse;
import com.example.backend.model.dto.response.ScheduleResponse;
import com.example.backend.model.dto.response.TimeSlotDisabledResponse;
import com.example.backend.model.dto.response.UserResponse;
import com.example.backend.model.entity.BookingEntity;
import com.example.backend.model.entity.ClientEntity;
import com.example.backend.model.entity.TimeSlotEntity;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.repository.BookingRepository;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.TimeSlotRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class BookingService {
    private final BookingRepository bookingRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;

    private final ClientRepository clientRepository;

    private final JwtService jwtService;


    public BookingService(BookingRepository bookingRepository, TimeSlotRepository timeSlotRepository, UserRepository userRepository, JwtService jwtService, ClientRepository clientRepository) {
        this.bookingRepository = bookingRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.clientRepository = clientRepository;
    }

    public ResponseEntity<UserResponse> currentUser(String token){
        System.out.println("Token: " + token);
        String email = jwtService.extractUsername(token);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole().equals(Role.CLIENT)){
            ClientEntity client = clientRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Client not found"));
            return ResponseEntity.ok(new UserResponse(client.getId(), user.getEmail(), user.getName(), user.getRole()));
        } else {
            return ResponseEntity.ok(new UserResponse(user.getId(), user.getEmail(), user.getName(), user.getRole()));
        }
    }

    public ResponseEntity<ScheduleResponse> getBookings(String token, LocalDate startDate, LocalDate endDate) {
        String email = jwtService.extractUsername(token);

        System.out.println("Email: " + email);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<BookingsResponse> bookingsResponse;

        if(user.getRole().equals(Role.ADMIN)|| user.getRole().equals(Role.TRAINER)) {
            bookingsResponse=  bookingRepository.findAllByTimeSlotDateBetween(startDate,endDate).stream().map(
                    bookingEntity -> new BookingsResponse(
                            bookingEntity.getId(),
                            bookingEntity.getClient().getId(),
                            bookingEntity.getClient().getUser().getName(),
                            bookingEntity.getTimeSlot().getDate(),
                            bookingEntity.getTimeSlot().getStartTime(),
                            bookingEntity.getTimeSlot().getEndTime(),
                            bookingEntity.getCreatedAt())).toList();
        } else {
            //prendo client asscoiato all'utente
            ClientEntity client = clientRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Client not found"));

            bookingsResponse=bookingRepository.findAllByClientIdAndTimeSlotDateBetween(client.getId(), startDate, endDate)
                    .stream()
                    .map(booking -> new BookingsResponse(
                            booking.getId(),
                            booking.getClient().getId(),
                            booking.getClient().getUser().getName(),
                            booking.getTimeSlot().getDate(),
                            booking.getTimeSlot().getStartTime(),
                            booking.getTimeSlot().getEndTime(),
                            booking.getCreatedAt())).toList();
        }

        List<TimeSlotDisabledResponse> timeSlotsDisabledResponse= timeSlotRepository.findDisabledTimeSlotsBetweenDates(startDate,endDate)
                .stream().map(
                        timeSlotEntity -> new TimeSlotDisabledResponse(
                                timeSlotEntity.getDate(),
                                timeSlotEntity.getStartTime(),
                                timeSlotEntity.getEndTime()
                        )
                ).toList();

        ScheduleResponse scheduleResponse=new ScheduleResponse(bookingsResponse, timeSlotsDisabledResponse);
        return ResponseEntity.ok(scheduleResponse);

    }

    private boolean isValidTimeSlot(LocalDate date, LocalTime startTime, LocalTime endTime) {
        // Controllo che la data non sia nel passato
        if (date.isBefore(LocalDate.now())) {
            return false;
        }

        // Controllo che l'orario di inizio sia prima dell'orario di fine
        if (startTime.isAfter(endTime)) {
            return false;
        }

        // Ottengo il giorno della settimana
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        Optional<LocalTime> openingTime = GymSchedule.getInstance().getOpeningHour(dayOfWeek);
        Optional<LocalTime> closingTime = GymSchedule.getInstance().getClosingHour(dayOfWeek);

        // Controllo che il giorno sia aperto
        if (openingTime.isEmpty() || closingTime.isEmpty()) {
            return false; // Il giorno è chiuso
        }

        // Controllo che l'orario di inizio sia dopo l'orario di apertura e l'orario di fine sia prima dell'orario di chiusura
        if (startTime.isBefore(openingTime.get()) || endTime.isAfter(closingTime.get())) {
            return false; // Orario non valido
        }

        // Controllo che la durata dello slot sia valida
        if (startTime.plusMinutes(GymSchedule.getInstance().getHoursSlotDuration()).isBefore(endTime)) {
            return false;
        }

        return true;
    }
    @Transactional
    public ResponseEntity<Integer> createBooking(String token, BookingRequest bookingRequest){
        String email = jwtService.extractUsername(token);
        ClientEntity client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // 1. Verifico se l'utente ha già una prenotazione per lo stesso giorno
        List<BookingEntity> existingBookings = bookingRepository.findAllByClientIdAndTimeSlotDateBetween(
                client.getId(),
                bookingRequest.getDate(),
                bookingRequest.getDate());
        if (!existingBookings.isEmpty()) {
            return ResponseEntity.status(409).build(); // Conflitto: l'utente ha già una prenotazione per quel giorno
        }

        // 2. Verifico validità dell'orario
        if (!isValidTimeSlot(bookingRequest.getDate(), bookingRequest.getStartTime(), bookingRequest.getEndTime())) {
            return ResponseEntity.badRequest().build(); // Orario non valido
        }

        // 3. Verifico se il time slot esiste, altrimenti lo creo
        TimeSlotEntity timeSlotEntity = timeSlotRepository.findByDateAndStartTimeAndEndTime(
                bookingRequest.getDate(),
                bookingRequest.getStartTime(),
                bookingRequest.getEndTime())
                // Se il time slot non esiste, lo creo
                .orElseGet(() -> {
                    TimeSlotEntity newTimeSlot = new TimeSlotEntity(
                            bookingRequest.getDate(),
                            bookingRequest.getStartTime(),
                            bookingRequest.getEndTime(),
                            GymSchedule.getInstance().getMaxBookingsPerDay()
                    );
                    return timeSlotRepository.save(newTimeSlot);
                });

        // 4. Verifico se il time slot è disabilitato
        if (timeSlotEntity.isDisabled()) {
            return ResponseEntity.status(403).build(); // Forbidden: il time slot è disabilitato
        }

        // 5. Verifico se il time slot ha raggiunto la capacità massima
        if (timeSlotEntity.getBookings().size() >= timeSlotEntity.getMaxCapacity()) {
            return ResponseEntity.status(409).build();
        }

        // 6. Creo la prenotazione
        BookingEntity bookingEntity = new BookingEntity(client, timeSlotEntity);
        bookingRepository.save(bookingEntity);

        return ResponseEntity.ok(bookingEntity.getId().intValue()); // Ritorno l'ID della prenotazione
    }

    @Transactional
    public ResponseEntity<Void> deleteBooking(String token, Long id){
        String email = jwtService.extractUsername(token);
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        BookingEntity booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (user.getRole().equals(Role.ADMIN)) {
            bookingRepository.delete(booking);
            return ResponseEntity.noContent().build();
        }


        //Verifico se sia l'autore della prenotazione
        ClientEntity client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        if (!booking.getClient().getId().equals(client.getId())) {
            return ResponseEntity.status(403).build(); // Forbidden: l'utente non è l'autore della prenotazione
        }
        // Rimuovo la prenotazione
        bookingRepository.delete(booking);

        return ResponseEntity.noContent().build();
    }


    private List<TimeSlotEntity> generateTimeSlotsForDate(LocalDate date) {
        List<TimeSlotEntity> timeSlots = new ArrayList<>();
        DayOfWeek dayOfWeek = date.getDayOfWeek();

        Optional<LocalTime> openingTime = GymSchedule.getInstance().getOpeningHour(dayOfWeek);
        Optional<LocalTime> closingTime = GymSchedule.getInstance().getClosingHour(dayOfWeek);

        if (openingTime.isEmpty() || closingTime.isEmpty()) {
            return timeSlots; // Il giorno è chiuso, non genero slot
        }

        LocalTime startTime = openingTime.get();
        LocalTime endTime = closingTime.get();
        while (startTime.isBefore(endTime)) {
            LocalTime nextEndTime = startTime.plusMinutes(GymSchedule.getInstance().getHoursSlotDuration());
            if (nextEndTime.isAfter(endTime)) {
                break; // Non posso creare uno slot che supera l'orario di chiusura
            }
            TimeSlotEntity timeSlot = new TimeSlotEntity(date, startTime, nextEndTime, GymSchedule.getInstance().getMaxBookingsPerDay());
            timeSlots.add(timeSlot);
            startTime = nextEndTime; // Passo allo slot successivo
        }

        return timeSlots;
    }

    @Transactional
    public ResponseEntity<Void> disableAllTimeSlotsForDate(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            return ResponseEntity.badRequest().build(); // Non posso disabilitare slot per date passate
        }

        // 1. Recupera tutti gli slot esistenti per la data
        List<TimeSlotEntity> existingSlots = timeSlotRepository.findAllByDate(date);

        // 2. Genera gli slot teorici previsti in base al giorno della settimana
        List<TimeSlotEntity> expectedSlots = generateTimeSlotsForDate(date);

        // 3. Mappa gli esistenti per confronto più veloce
        Map<String, TimeSlotEntity> existingSlotMap = existingSlots.stream()
                .collect(Collectors.toMap(
                        slot -> slot.getStartTime() + "-" + slot.getEndTime(),
                        Function.identity()
                ));

        List<TimeSlotEntity> toSave = new ArrayList<>();

        for (TimeSlotEntity expected : expectedSlots) {
            String key = expected.getStartTime() + "-" + expected.getEndTime();
            if (existingSlotMap.containsKey(key)) {
                // Slot già esistente → aggiorna
                TimeSlotEntity existing = existingSlotMap.get(key);
                existing.setDisabled(true);
                existing.getBookings().clear(); // Rimuove prenotazioni collegate .add(existing);
            } else {
                // Slot non esiste → lo disabilito soltanto
                expected.setDisabled(true);
                toSave.add(expected);
            }
        }

        // 5. Salva tutti
        timeSlotRepository.saveAll(toSave);

        return ResponseEntity.noContent().build();

    }

    public ResponseEntity<Void> enableAllTimeSlotsForDate(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            return ResponseEntity.badRequest().build(); // Non posso abilitare slot per date passate
        }

        // 1. Recupera tutti gli slot esistenti per la data
        List<TimeSlotEntity> existingSlots = timeSlotRepository.findAllByDate(date);

        // 2. Abilita tutti gli slot esistenti
        List<TimeSlotEntity> toSave = new ArrayList<>();
        for (TimeSlotEntity slot : existingSlots) {
            slot.setDisabled(false);
            toSave.add(slot);
        }

        // 3. Salva tutti gli slot abilitati
        timeSlotRepository.saveAll(toSave);

        return ResponseEntity.noContent().build();
    }

    @Transactional
    public ResponseEntity<Void> disableTimeSlots(LocalDate date, TimeSlotRequest timeSlotRequest) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            return ResponseEntity.badRequest().build(); // Non posso disabilitare slot per date passate
        }
        // Controllo che gli orari siano validi e li disabilito
        for (int i = 0; i < timeSlotRequest.getTimeSlots().size(); i++) {
            LocalTime startTime = timeSlotRequest.getStartTimeIndex(i);
            LocalTime endTime = timeSlotRequest.getEndTimeIndex(i);

            if (!isValidTimeSlot(date, startTime, endTime)) {
                return ResponseEntity.badRequest().build(); // Orario non valido
            }

            // Prendo il timeslot
            TimeSlotEntity timeSlotEntity = timeSlotRepository.findByDateAndStartTimeAndEndTime(
                    date, startTime, endTime)
                    .orElse(null);

            if (timeSlotEntity == null) {
                continue; // Se il timeslot non esiste, lo ignoro
            }

            timeSlotEntity.setDisabled(true);
            timeSlotEntity.getBookings().clear();

            // Salvo il timeslot disabilitato
            timeSlotRepository.save(timeSlotEntity);
        }

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> enableTimeSlots(LocalDate date, TimeSlotRequest timeSlotRequest) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            return ResponseEntity.badRequest().build(); // Non posso abilitare slot per date passate
        }
        // Controllo che gli orari siano validi e li abilito
        for (int i = 0; i < timeSlotRequest.getTimeSlots().size(); i++) {
            LocalTime startTime = timeSlotRequest.getStartTimeIndex(i);
            LocalTime endTime = timeSlotRequest.getEndTimeIndex(i);

            if (!isValidTimeSlot(date, startTime, endTime)) {
                return ResponseEntity.badRequest().build(); // Orario non valido
            }

            // Prendo il timeslot
            TimeSlotEntity timeSlotEntity = timeSlotRepository.findByDateAndStartTimeAndEndTime(
                    date, startTime, endTime)
                    .orElse(null);

            if (timeSlotEntity == null) {
                continue; // Se il timeslot non esiste, lo ignoro
            }

            timeSlotEntity.setDisabled(false);

            // Salvo il timeslot abilitato
            timeSlotRepository.save(timeSlotEntity);
        }

        return ResponseEntity.noContent().build();
    }




    @Transactional
    public ResponseEntity<Void> disableTimeSlot(BookingRequest timeslot){
        LocalDate today = LocalDate.now();
        if (timeslot.getDate().isBefore(today)) {
            throw new IllegalArgumentException("Cannot disable time slots for past dates");
        }

        if(!isValidTimeSlot(timeslot.getDate(), timeslot.getStartTime(), timeslot.getEndTime())) {
            return ResponseEntity.badRequest().build(); // Orario non valido
        }

       // 1. Trovo il timeslot, se non esiste lo creo
        TimeSlotEntity timeSlotEntity = timeSlotRepository.findByDateAndStartTimeAndEndTime(
                        timeslot.getDate(),
                        timeslot.getStartTime(),
                        timeslot.getEndTime())
                // Se il time slot non esiste, lo creo
                .orElseGet(() -> {
                    TimeSlotEntity newTimeSlot = new TimeSlotEntity(
                            timeslot.getDate(),
                            timeslot.getStartTime(),
                            timeslot.getEndTime(),
                            GymSchedule.getInstance().getMaxBookingsPerDay()
                    );
                    return timeSlotRepository.save(newTimeSlot);
                });

        // 2. Disabilito il timeslot
        timeSlotEntity.setDisabled(true);

        // 3. Rimuovo tutte le prenotazioni associate
        timeSlotEntity.getBookings().clear();

        // 4. Salvo le modifiche
        timeSlotRepository.save(timeSlotEntity);

        return ResponseEntity.noContent().build();
    }






}
