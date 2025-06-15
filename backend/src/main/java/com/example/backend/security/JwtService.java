package com.example.backend.security;

import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.*;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private static final String SECRET_KEY ="3273357638792F423F4528482B4D6251655368566D597133743677397A244326";

    public String extractUsername(String token) { // Estrae il nome utente dal token JWT
        return extractClaim(token,Claims::getSubject);
    }

    public <T>T extractClaim(String token, Function<Claims,T> claimsResolver){ // Estrae un claim specifico dal token JWT
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails){ // Genera un token JWT per l'utente specificato
        return generateToken(new HashMap<>(),userDetails);
    }

    public String generateToken(  // Genera un token JWT con claims aggiuntivi
            Map<String,Object> extraClaims,
            UserDetails userDetails
    ){
        return Jwts
                .builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis()+1000*60*24)) // Token valido per 24 ore
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails){ // Verifica se il token JWT è valido per l'utente specificato
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) { // Controlla se il token JWT è scaduto
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) { // Estrae la data di scadenza dal token JWT
        return  extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token){ // Estrae tutti i claims dal token JWT
        return Jwts
                .parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSignInKey() { // Ottiene la chiave segreta per la firma del token JWT
        byte[] keyBytes = Base64.getDecoder().decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
