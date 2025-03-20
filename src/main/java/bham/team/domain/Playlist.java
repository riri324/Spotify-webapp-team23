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
 * A Playlist.
 */
@Entity
@Table(name = "playlist")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Playlist implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "playlist_id", nullable = false, unique = true)
    private Integer playlistID;

    @NotNull
    @Size(max = 50)
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Size(max = 100)
    @Column(name = "description", length = 100)
    private String description;

    @NotNull
    @Column(name = "is_public", nullable = false)
    private Boolean isPublic;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_playlist__songs",
        joinColumns = @JoinColumn(name = "playlist_id"),
        inverseJoinColumns = @JoinColumn(name = "songs_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "album", "genre", "artist", "playlists" }, allowSetters = true)
    private Set<Song> songs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Playlist id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPlaylistID() {
        return this.playlistID;
    }

    public Playlist playlistID(Integer playlistID) {
        this.setPlaylistID(playlistID);
        return this;
    }

    public void setPlaylistID(Integer playlistID) {
        this.playlistID = playlistID;
    }

    public String getName() {
        return this.name;
    }

    public Playlist name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Playlist description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPublic() {
        return this.isPublic;
    }

    public Playlist isPublic(Boolean isPublic) {
        this.setIsPublic(isPublic);
        return this;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Set<Song> getSongs() {
        return this.songs;
    }

    public void setSongs(Set<Song> songs) {
        this.songs = songs;
    }

    public Playlist songs(Set<Song> songs) {
        this.setSongs(songs);
        return this;
    }

    public Playlist addSongs(Song song) {
        this.songs.add(song);
        return this;
    }

    public Playlist removeSongs(Song song) {
        this.songs.remove(song);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Playlist)) {
            return false;
        }
        return getId() != null && getId().equals(((Playlist) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Playlist{" +
            "id=" + getId() +
            ", playlistID=" + getPlaylistID() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", isPublic='" + getIsPublic() + "'" +
            "}";
    }
}
