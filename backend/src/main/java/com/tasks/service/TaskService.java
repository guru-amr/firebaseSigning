package com.tasks.service;

import com.tasks.model.Task;
import com.tasks.repository.TaskRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepo;
    private final SimpMessagingTemplate broker;

    public TaskService(TaskRepository taskRepo, SimpMessagingTemplate broker) {
        this.taskRepo = taskRepo;
        this.broker = broker;
    }

    public List<Task> getAll() { return taskRepo.findAll(); }

    public Task create(Task task) {
        task.setStatus("todo");
        Task saved = taskRepo.save(task);
        broker.convertAndSend("/topic/tasks", getAll());
        return saved;
    }

    public Task update(Long id, Task patch) {
        Task task = taskRepo.findById(id).orElseThrow();
        if (patch.getTitle() != null) task.setTitle(patch.getTitle());
        if (patch.getAssignee() != null) task.setAssignee(patch.getAssignee());
        if (patch.getPriority() != null) task.setPriority(patch.getPriority());
        if (patch.getStatus() != null) task.setStatus(patch.getStatus());
        Task saved = taskRepo.save(task);
        broker.convertAndSend("/topic/tasks", getAll());
        return saved;
    }

    public void delete(Long id) {
        taskRepo.deleteById(id);
        broker.convertAndSend("/topic/tasks", getAll());
    }
}
