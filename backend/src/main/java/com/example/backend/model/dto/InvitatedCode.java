package com.example.backend.model.dto;

import lombok.Data;

@Data
public class InvitatedCode {

    private long id;
    private String code;
    public void generateCode() {
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            int randomChar = (int) (Math.random() * 36);
            if (randomChar < 10) {
                code.append(randomChar);
            } else {
                code.append((char) ('A' + randomChar - 10));
            }
        }
        this.code = code.toString();
    }
}
