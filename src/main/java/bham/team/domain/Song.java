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
    @Column(name = "track_id", nullable = false, unique = true)
    private String trackId;

    @Column(name = "artists")
    private String artists;

    @Column(name = "album_name")
    private String albumName;

    @Column(name = "track_name")
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

    @Column(name = "track_genre")
    private String trackGenre;

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

    public String getTrackId() {
        return this.trackId;
    }

    public Song trackId(String trackId) {
        this.setTrackId(trackId);
        return this;
    }

    public void setTrackId(String trackId) {
        this.trackId = trackId;
    }

    public String getArtists() {
        return this.artists;
    }

    public Song artists(String artists) {
        this.setArtists(artists);
        return this;
    }

    public void setArtists(String artists) {
        this.artists = artists;
    }

    public String getAlbumName() {
        return this.albumName;
    }

    public Song albumName(String albumName) {
        this.setAlbumName(albumName);
        return this;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
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

    public String getTrackGenre() {
        return this.trackGenre;
    }

    public Song trackGenre(String trackGenre) {
        this.setTrackGenre(trackGenre);
        return this;
    }

    public void setTrackGenre(String trackGenre) {
        this.trackGenre = trackGenre;
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
            ", trackId='" + getTrackId() + "'" +
            ", artists='" + getArtists() + "'" +
            ", albumName='" + getAlbumName() + "'" +
            ", trackName='" + getTrackName() + "'" +
            ", danceability=" + getDanceability() +
            ", energy=" + getEnergy() +
            ", speechiness=" + getSpeechiness() +
            ", acousticness=" + getAcousticness() +
            ", instrumentalness=" + getInstrumentalness() +
            ", liveness=" + getLiveness() +
            ", valence=" + getValence() +
            ", tempo=" + getTempo() +
            ", trackGenre='" + getTrackGenre() + "'" +
            "}";
    }
}
