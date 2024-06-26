package com.example.backend.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Anime;
import com.example.backend.entity.Favorito;
import com.example.backend.entity.OtakuList;
import com.example.backend.repository.AnimesRepository;
import com.example.backend.repository.FavoritoRepository;
import com.example.backend.repository.OtakuListsRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

/**
 * Controlador para gestionar operaciones relacionadas con animes, listas de
 * favoritos y listas de Otaku.
 */
@RestController
@RequestMapping("/data")
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
public class DBController {

    @Autowired
    private FavoritoRepository favoritosRepository;

    @Autowired
    private OtakuListsRepository otakuListRepository;

    @Autowired
    private AnimesRepository animeRepository;

    /**
     * Obtiene todos los animes favoritos.
     * 
     * @return una lista de animes favoritos.
     */
    @GetMapping("/favs")
    public List<Anime> getFavs() {
        List<Anime> animes = new ArrayList<Anime>();
        for (Favorito fav : favoritosRepository.findAll()) {
            animes.add(fav.getAnime());
        }
        return animes;
    }

    /**
     * Guarda un anime como favorito.
     * 
     * @param animefav el anime a guardar.
     * @return el anime guardado.
     */
    @PostMapping("/save")
    public Anime savAnime(@RequestBody Anime animefav) {
        Optional<Anime> existingAnime = animeRepository.findById(animefav.getId());
        Anime animeToSave;
        if (existingAnime.isPresent()) {
            animeToSave = existingAnime.get();
        } else {
            animeToSave = animeRepository.save(animefav);
        }
        this.favoritosRepository.save(new Favorito(animeToSave));
        return animeToSave;
    }

    /**
     * Elimina un anime favorito por su ID.
     * 
     * @param id el ID del anime a eliminar.
     * @return una respuesta vacía si se elimina correctamente, o una respuesta de
     *         no encontrado.
     */
    @DeleteMapping("/deletefav/{id}")
    public ResponseEntity<Void> deleteAnimefav(@PathVariable String id) {
        Optional<Favorito> entity = this.favoritosRepository.findByAnimeId(id);
        if (entity.isPresent()) {
            this.favoritosRepository.deleteById(entity.get().getId());
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Crea una nueva lista de Otaku.
     * 
     * @param otakuList la lista de Otaku a crear.
     * @return la lista de Otaku creada.
     */
    @PostMapping("/createlist")
    public OtakuList postMethodName(@RequestBody OtakuList otakuList) {
        System.out.println(otakuList.getUpDate());
        return this.otakuListRepository.save(otakuList);
    }

    /**
     * Obtiene todas las listas de Otaku.
     * 
     * @return una lista de todas las listas de Otaku.
     */
    @GetMapping("/getOtakuLists")
    public List<OtakuList> getOtakuLists() {
        return (List<OtakuList>) otakuListRepository.findAll();
    }

    /**
     * Obtiene una lista de Otaku por su ID.
     * 
     * @param id el ID de la lista de Otaku.
     * @return la lista de Otaku si se encuentra, o una respuesta de no encontrado.
     */
    @GetMapping("/getOtakuList/{id}")
    public ResponseEntity<OtakuList> getOtakuList(@PathVariable String id) {
        Optional<OtakuList> otakuList = this.otakuListRepository.findById(Long.parseLong(id));
        if (otakuList.isPresent()) {
            return ResponseEntity.ok(otakuList.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Elimina una lista de Otaku por su ID.
     * 
     * @param id el ID de la lista de Otaku a eliminar.
     * @return una respuesta vacía si se elimina correctamente, o una respuesta de
     *         no encontrado.
     */
    @DeleteMapping("/deleteList/{id}")
    public ResponseEntity<Void> deleteOtakuList(@PathVariable String id) {
        Optional<OtakuList> entity = this.otakuListRepository.findById(Long.parseLong(id));
        if (entity.isPresent()) {
            entity.get().getAnimes().clear();
            this.otakuListRepository.save(entity.get());
            this.otakuListRepository.deleteById(Long.parseLong(id));
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Actualiza una lista de Otaku.
     * 
     * @param list la lista de Otaku con la información actualizada.
     * @return la lista de Otaku actualizada si se encuentra, o una respuesta de no
     *         encontrado.
     */
    @PutMapping("updateOtakuList")
    public ResponseEntity<OtakuList> putMethodName(@RequestBody OtakuList list) {
        Optional<OtakuList> otakuList = this.otakuListRepository.findById(list.getId());
        if (otakuList.isPresent()) {
            OtakuList otakuListEntity = otakuList.get();
            otakuListEntity.setTitle(list.getTitle());

            List<Anime> animesToAdd = new ArrayList<>();
            for (Anime anime : list.getAnimes()) {
                Optional<Anime> existingAnime = this.animeRepository.findById(anime.getId());
                if (existingAnime.isPresent() && !otakuListEntity.getAnimes().contains(existingAnime.get())) {
                    animesToAdd.add(existingAnime.get());
                }
            }
            otakuListEntity.getAnimes().addAll(animesToAdd);

            this.otakuListRepository.save(otakuListEntity);
            return ResponseEntity.ok(otakuListEntity);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Realiza un web scraping de una página específica para obtener información de
     * premios y ganadores de anime.
     * 
     * @return un HashMap con los títulos de premios y sus respectivos ganadores.
     */
    @GetMapping("/scrapping")
    public HashMap<String, ArrayList<String>> getScrapping() {
        HashMap<String, ArrayList<String>> resultados = new LinkedHashMap<>();

        try {
            Document webPage = Jsoup
                    .connect("https://es.wikipedia.org/wiki/8.%C2%AA_edici%C3%B3n_de_los_Crunchyroll_Anime_Awards")
                    .get();
            Element table = webPage.select("table.wikitable").first();

            if (table != null) {
                Elements rows = table.select("tr:lt(3)");

                for (Element row : rows) {
                    Elements tdElements = row.select("td:lt(3)");

                    if (!tdElements.isEmpty()) {
                        for (Element tdElement : tdElements) {
                            // Obtener el título del premio
                            String awardTitle = tdElement.selectFirst("div").text();

                            // Obtener el nombre del ganador
                            String animeName = tdElement.selectFirst("ul li b i a").text();

                            // Crear una entrada en el HashMap con el título del premio como clave
                            if (!resultados.containsKey(awardTitle)) {
                                resultados.put(awardTitle, new ArrayList<>());
                            }

                            // Agregar el nombre del ganador al ArrayList bajo la clave del título del premio
                            resultados.get(awardTitle).add(animeName);
                        }
                    }
                }
            }

        } catch (IOException e) {
            e.printStackTrace(); // Manejo básico de errores, se puede mejorar según el contexto
        }

        return resultados;
    }

}
