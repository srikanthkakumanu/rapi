package com.rapi.domain;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

@Entity
@Data
public class ThemeParkRide {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @NotEmpty
  private String name;

  @NotEmpty
  private String description;

  private int thrillFactor;
  private int vomitFactor;
  private LocalDateTime created = LocalDateTime.now();
  private LocalDateTime modified = LocalDateTime.now();

  public ThemeParkRide() { 
    LocalDateTime date = LocalDateTime.now();
    this.created = date;
    this.modified = date;
  }

  public ThemeParkRide(String name, String description, int thrillFactor, int vomitFactor) {
    this();
    this.name = name;
    this.description = description;
    this.thrillFactor = thrillFactor;
    this.vomitFactor = vomitFactor;
    created = LocalDateTime.now();
    modified = LocalDateTime.now();
  }

}
