package bham.team.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Genre.
 */
@Entity
@Table(name = "genre")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Genre implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "genre_id", nullable = false, unique = true)
    private Integer genreID;

    @NotNull
    @Size(max = 50)
    @Column(name = "song_genre", length = 50, nullable = false)
    private String songGenre;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "genre")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "album", "genre", "artist", "playlists" }, allowSetters = true)
    private Set<Song> songs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Genre id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getGenreID() {
        return this.genreID;
    }

    public Genre genreID(Integer genreID) {
        this.setGenreID(genreID);
        return this;
    }

    public void setGenreID(Integer genreID) {
        this.genreID = genreID;
    }

    public String getSongGenre() {
        return this.songGenre;
    }

    public Genre songGenre(String songGenre) {
        this.setSongGenre(songGenre);
        return this;
    }

    public void setSongGenre(String songGenre) {
        this.songGenre = songGenre;
    }

    public Set<Song> getSongs() {
        return this.songs;
    }

    public void setSongs(Set<Song> songs) {
        if (this.songs != null) {
            this.songs.forEach(i -> i.setGenre(null));
        }
        if (songs != null) {
            songs.forEach(i -> i.setGenre(this));
        }
        this.songs = songs;
    }

    public Genre songs(Set<Song> songs) {
        this.setSongs(songs);
        return this;
    }

    public Genre addSongs(Song song) {
        this.songs.add(song);
        song.setGenre(this);
        return this;
    }

    public Genre removeSongs(Song song) {
        this.songs.remove(song);
        song.setGenre(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Genre)) {
            return false;
        }
        return getId() != null && getId().equals(((Genre) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Genre{" +
            "id=" + getId() +
            ", genreID=" + getGenreID() +
            ", songGenre='" + getSongGenre() + "'" +
            "}";
    }
}
