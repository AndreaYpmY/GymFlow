package com.example.backend.model.dto.response;

import com.example.backend.enums.Role;

import java.util.List;

public class PageResponse {
    /*@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isVerified)*/
    private int total;
    private int page;
    private int limit;
    private int totalPages;
    private List<UserForAdmin> users;

    public PageResponse() {
    }

    public PageResponse(List<UserForAdmin> users, int total, int page, int limit, int totalPages) {
        this.users = users;
        this.total = total;
        this.page = page;
        this.limit = limit;
        this.totalPages = totalPages;
    }

    public int getTotal() {
        return total;
    }

    public void setTotal(int total) {
        this.total = total;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public List<UserForAdmin> getUsers() {
        return users;
    }

    public void setUsers(List<UserForAdmin> users) {
        this.users = users;
    }
}
