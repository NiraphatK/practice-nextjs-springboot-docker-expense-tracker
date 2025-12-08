package com.practice.expensetracker.controller;

import com.practice.expensetracker.entity.Expense;
import com.practice.expensetracker.repository.ExpenseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseRepository repository;

    public ExpenseController(ExpenseRepository repository) {
        this.repository = repository;
    }

    // ดึงข้อมูลทั้งหมด
    @GetMapping
    public List<Expense> getAll() {
        return repository.findAll();
    }

    // เพิ่มข้อมูลใหม่
    @PostMapping
    public Expense create(@RequestBody Expense expense) {
        if (expense.getDate() == null) expense.setDate(java.time.LocalDate.now());
        return repository.save(expense);
    }

    // ลบข้อมูล
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
