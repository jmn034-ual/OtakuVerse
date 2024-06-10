package com.example.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.backend.entity.OtakuList;

@RepositoryRestResource 
public interface OtakuListsRepository  extends CrudRepository<OtakuList, Long>{
    
}

