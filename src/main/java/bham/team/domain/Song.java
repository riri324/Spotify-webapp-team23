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
 * A Song.
 */
@Entity
@Table(name = "song")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Song implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 50)
    @Column(name = "song_id", length = 50, nullable = false, unique = true)
    private String songId;

    @NotNull
    @Size(max = 150)
    @Column(name = "track_name", length = 150, nullable = false)
    private String trackName;

    @Column(name = "danceability")
    private Float danceability;

    @Column(name = "energy")
    private Float energy;

    @Column(name = "speechiness")
    private Float speechiness;

    @Column(name = "acousticness")
    private Float acousticness;

    @Column(name = "instrumentalness")
    private Float instrumentalness;

    @Column(name = "liveness")
    private Float liveness;

    @Column(name = "valence")
    private Float valence;

    @Column(name = "tempo")
    private Float tempo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "artist", "songs" }, allowSetters = true)
    private Album album;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "songs" }, allowSetters = true)
    private Genre genre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "albums", "songs" }, allowSetters = true)
    private Artist artist;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "songs")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "songs" }, allowSetters = true)
    private Set<Playlist> playlists = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Song id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSongId() {
        return this.songId;
    }

    public Song songId(String songId) {
        this.setSongId(songId);
        return this;
    }

    public void setSongId(String songId) {
        this.songId = songId;
    }

    public String getTrackName() {
        return this.trackName;
    }

    public Song trackName(String trackName) {
        this.setTrackName(trackName);
        return this;
    }

    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }

    public Float getDanceability() {
        return this.danceability;
    }

    public Song danceability(Float danceability) {
        this.setDanceability(danceability);
        return this;
    }

    public void setDanceability(Float danceability) {
        this.danceability = danceability;
    }

    public Float getEnergy() {
        return this.energy;
    }

    public Song energy(Float energy) {
        this.setEnergy(energy);
        return this;
    }

    public void setEnergy(Float energy) {
        this.energy = energy;
    }

    public Float getSpeechiness() {
        return this.speechiness;
    }

    public Song speechiness(Float speechiness) {
        this.setSpeechiness(speechiness);
        return this;
    }

    public void setSpeechiness(Float speechiness) {
        this.speechiness = speechiness;
    }

    public Float getAcousticness() {
        return this.acousticness;
    }

    public Song acousticness(Float acousticness) {
        this.setAcousticness(acousticness);
        return this;
    }

    public void setAcousticness(Float acousticness) {
        this.acousticness = acousticness;
    }

    public Float getInstrumentalness() {
        return this.instrumentalness;
    }

    public Song instrumentalness(Float instrumentalness) {
        this.setInstrumentalness(instrumentalness);
        return this;
    }

    public void setInstrumentalness(Float instrumentalness) {
        this.instrumentalness = instrumentalness;
    }

    public Float getLiveness() {
        return this.liveness;
    }

    public Song liveness(Float liveness) {
        this.setLiveness(liveness);
        return this;
    }

    public void setLiveness(Float liveness) {
        this.liveness = liveness;
    }

    public Float getValence() {
        return this.valence;
    }

    public Song valence(Float valence) {
        this.setValence(valence);
        return this;
    }

    public void setValence(Float valence) {
        this.valence = valence;
    }

    public Float getTempo() {
        return this.tempo;
    }

    public Song tempo(Float tempo) {
        this.setTempo(tempo);
        return this;
    }

    public void setTempo(Float tempo) {
        this.tempo = tempo;
    }

    public Album getAlbum() {
        return this.album;
    }

    public void setAlbum(Album album) {
        this.album = album;
    }

    public Song album(Album album) {
        this.setAlbum(album);
        return this;
    }

    public Genre getGenre() {
        return this.genre;
    }

    public void setGenre(Genre genre) {
        this.genre = genre;
    }

    public Song genre(Genre genre) {
        this.setGenre(genre);
        return this;
    }

    public Artist getArtist() {
        return this.artist;
    }

    public void setArtist(Artist artist) {
        this.artist = artist;
    }

    public Song artist(Artist artist) {
        this.setArtist(artist);
        return this;
    }

    public Set<Playlist> getPlaylists() {
        return this.playlists;
    }

    public void setPlaylists(Set<Playlist> playlists) {
        if (this.playlists != null) {
            this.playlists.forEach(i -> i.removeSongs(this));
        }
        if (playlists != null) {
            playlists.forEach(i -> i.addSongs(this));
        }
        this.playlists = playlists;
    }

    public Song playlists(Set<Playlist> playlists) {
        this.setPlaylists(playlists);
        return this;
    }

    public Song addPlaylists(Playlist playlist) {
        this.playlists.add(playlist);
        playlist.getSongs().add(this);
        return this;
    }

    public Song removePlaylists(Playlist playlist) {
        this.playlists.remove(playlist);
        playlist.getSongs().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Song)) {
            return false;
        }
        return getId() != null && getId().equals(((Song) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Song{" +
            "id=" + getId() +
            ", songId='" + getSongId() + "'" +
            ", trackName='" + getTrackName() + "'" +
            ", danceability=" + getDanceability() +
            ", energy=" + getEnergy() +
            ", speechiness=" + getSpeechiness() +
            ", acousticness=" + getAcousticness() +
            ", instrumentalness=" + getInstrumentalness() +
            ", liveness=" + getLiveness() +
            ", valence=" + getValence() +
            ", tempo=" + getTempo() +
            "}";
    }
}
