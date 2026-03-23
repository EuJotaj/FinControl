package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.Category;
import com.fincontrol.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findAllByUser(User user);
}
