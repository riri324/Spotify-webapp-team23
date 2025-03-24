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
 * A Artist.
 */
@Entity
@Table(name = "artist")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Artist implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "artist_name", length = 100, nullable = false)
    private String artistName;

    @NotNull
    @Column(name = "followers", nullable = false)
    private Integer followers;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "artist")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "artist", "songs" }, allowSetters = true)
    private Set<Album> albums = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "artist")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "album", "genre", "artist", "playlists" }, allowSetters = true)
    private Set<Song> songs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Artist id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArtistName() {
        return this.artistName;
    }

    public Artist artistName(String artistName) {
        this.setArtistName(artistName);
        return this;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public Integer getFollowers() {
        return this.followers;
    }

    public Artist followers(Integer followers) {
        this.setFollowers(followers);
        return this;
    }

    public void setFollowers(Integer followers) {
        this.followers = followers;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Artist image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Artist imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Set<Album> getAlbums() {
        return this.albums;
    }

    public void setAlbums(Set<Album> albums) {
        if (this.albums != null) {
            this.albums.forEach(i -> i.setArtist(null));
        }
        if (albums != null) {
            albums.forEach(i -> i.setArtist(this));
        }
        this.albums = albums;
    }

    public Artist albums(Set<Album> albums) {
        this.setAlbums(albums);
        return this;
    }

    public Artist addAlbums(Album album) {
        this.albums.add(album);
        album.setArtist(this);
        return this;
    }

    public Artist removeAlbums(Album album) {
        this.albums.remove(album);
        album.setArtist(null);
        return this;
    }

    public Set<Song> getSongs() {
        return this.songs;
    }

    public void setSongs(Set<Song> songs) {
        if (this.songs != null) {
            this.songs.forEach(i -> i.setArtist(null));
        }
        if (songs != null) {
            songs.forEach(i -> i.setArtist(this));
        }
        this.songs = songs;
    }

    public Artist songs(Set<Song> songs) {
        this.setSongs(songs);
        return this;
    }

    public Artist addSongs(Song song) {
        this.songs.add(song);
        song.setArtist(this);
        return this;
    }

    public Artist removeSongs(Song song) {
        this.songs.remove(song);
        song.setArtist(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Artist)) {
            return false;
        }
        return getId() != null && getId().equals(((Artist) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Artist{" +
            "id=" + getId() +
            ", artistName='" + getArtistName() + "'" +
            ", followers=" + getFollowers() +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
