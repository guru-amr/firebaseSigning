package com.tasks.controller;

import com.tasks.model.Task;
import com.tasks.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    public TaskController(TaskService taskService) { this.taskService = taskService; }

    @GetMapping
    public List<Task> getAll() { return taskService.getAll(); }

    @PostMapping
    public Task create(@RequestBody Task task) { return taskService.create(task); }

    @PatchMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task patch) {
        try { return ResponseEntity.ok(taskService.update(id, patch)); }
        catch (Exception e) { return ResponseEntity.notFound().build(); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
