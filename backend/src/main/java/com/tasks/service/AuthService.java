package com.tasks.service;

import com.tasks.model.User;
import com.tasks.repository.UserRepository;
import com.tasks.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    public String register(String email, String password) {
        if (userRepo.findByEmail(email).isPresent()) throw new RuntimeException("Email already in use");
        User user = new User();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        userRepo.save(user);
        return jwtUtil.generate(email);
    }

    public String login(String email, String password) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(password, user.getPassword())) throw new RuntimeException("Invalid credentials");
        return jwtUtil.generate(email);
    }
}
