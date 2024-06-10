package com.example.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.backend.entity.Anime;

@RepositoryRestResource 
public interface AnimesRepository extends CrudRepository<Anime, String>{
    
}
