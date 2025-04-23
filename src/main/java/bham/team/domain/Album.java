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
 * A Album.
 */
@Entity
@Table(name = "album")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Album implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "album_id", nullable = false, unique = true)
    private Integer albumID;

    @NotNull
    @Size(max = 150)
    @Column(name = "album_name", length = 150, nullable = false)
    private String albumName;

    @NotNull
    @Column(name = "number_of_songs", nullable = false)
    private Integer numberOfSongs;

    @Lob
    @Column(name = "image")
    private byte[] image;

    @Column(name = "image_content_type")
    private String imageContentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "events", "albums", "songs" }, allowSetters = true)
    private Artist artist;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "album")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(
        value = { "globalTopsongs", "album", "genre", "artist", "likedSongs", "playlists", "listeningHistories" },
        allowSetters = true
    )
    private Set<Song> songs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Album id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAlbumID() {
        return this.albumID;
    }

    public Album albumID(Integer albumID) {
        this.setAlbumID(albumID);
        return this;
    }

    public void setAlbumID(Integer albumID) {
        this.albumID = albumID;
    }

    public String getAlbumName() {
        return this.albumName;
    }

    public Album albumName(String albumName) {
        this.setAlbumName(albumName);
        return this;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public Integer getNumberOfSongs() {
        return this.numberOfSongs;
    }

    public Album numberOfSongs(Integer numberOfSongs) {
        this.setNumberOfSongs(numberOfSongs);
        return this;
    }

    public void setNumberOfSongs(Integer numberOfSongs) {
        this.numberOfSongs = numberOfSongs;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Album image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Album imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Artist getArtist() {
        return this.artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public Album artist(Artist artist) {
        this.setArtist(artist);
        return this;
    }

    public Set<Song> getSongs() {
        return this.songs;
    }

    public void setSongs(Set<Song> songs) {
        if (this.songs != null) {
            this.songs.forEach(i -> i.setAlbum(null));
        }
        if (songs != null) {
            songs.forEach(i -> i.setAlbum(this));
        }
        this.songs = songs;
    }

    public Album songs(Set<Song> songs) {
        this.setSongs(songs);
        return this;
    }

    public Album addSong(Song song) {
        this.songs.add(song);
        song.setAlbum(this);
        return this;
    }

    public Album removeSong(Song song) {
        this.songs.remove(song);
        song.setAlbum(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Album)) {
            return false;
        }
        return getId() != null && getId().equals(((Album) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Album{" +
            "id=" + getId() +
            ", albumID=" + getAlbumID() +
            ", albumName='" + getAlbumName() + "'" +
            ", numberOfSongs=" + getNumberOfSongs() +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
