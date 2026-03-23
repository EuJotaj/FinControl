package com.fincontrol.application.services;

import com.fincontrol.domain.models.Category;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.CategoryRepository;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public List<Category> getUserCategories() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return categoryRepository.findAllByUser(user);
    }

    public Category createCategory(Category category) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        category.setUser(user);
        return categoryRepository.save(category);
    }
}
