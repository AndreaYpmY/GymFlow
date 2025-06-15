package com.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
//@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final UserDetailsService userDetailsService;

    private final JwtService jwtService;

    public JwtAuthenticationFilter(UserDetailsService userDetailsService, JwtService jwtService) {
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }


    //Per ogni richiesta http in arrivo, il filtro verifica se l'header Authorization è presente e contiene un token JWT valido.
    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }
        String jwt = null;
        String userEmail = null;
        Cookie[] cookies = request.getCookies();
        if(cookies != null) {
            for (Cookie cookie : cookies) {
                if ("token".equals(cookie.getName())) {
                    jwt = cookie.getValue(); // Recupera il token JWT dal cookie
                    break;
                }
            }
        }

        // Se non c'è il token, continua senza autenticazione
        if (jwt == null) {
            filterChain.doFilter(request, response); // Continua la catena di filtri senza autenticazione
            return;
        }

        //Estraggo userEmail dal token JWT
        userEmail = jwtService.extractUsername(jwt);
        //System.out.println("User email extracted from JWT: " + userEmail);

        // Controllo che: Abbiamo trovato un userEmail; Nessun utente è già autenticato nella richiesta corrente
        if(userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails person = this.userDetailsService.loadUserByUsername(userEmail);
            if(jwtService.isTokenValid(jwt, person)) {
                // Creo un oggetto di autenticazione con i dettagli dell'utente e le sue autorità
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        person, null, person.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                // Adesso considero l'utente autenticato
            }
        }
        System.out.println("JWT Authentication Filter executed for user: " + userEmail);
        // Continua la catena di filtri
        filterChain.doFilter(request, response);

    }
}
