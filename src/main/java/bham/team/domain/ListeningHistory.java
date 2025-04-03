package bham.team.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ListeningHistory.
 */
@Entity
@Table(name = "listening_history")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ListeningHistory implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "history_id", nullable = false, unique = true)
    private Integer historyID;

    @NotNull
    @Column(name = "timestamp", nullable = false)
    private Instant timestamp;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_listening_history__song",
        joinColumns = @JoinColumn(name = "listening_history_id"),
        inverseJoinColumns = @JoinColumn(name = "song_id")
    )
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

    public ListeningHistory id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getHistoryID() {
        return this.historyID;
    }

    public ListeningHistory historyID(Integer historyID) {
        this.setHistoryID(historyID);
        return this;
    }

    public void setHistoryID(Integer historyID) {
        this.historyID = historyID;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public ListeningHistory timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public Set<Song> getSongs() {
        return this.songs;
    }

    public void setSongs(Set<Song> songs) {
        this.songs = songs;
    }

    public ListeningHistory songs(Set<Song> songs) {
        this.setSongs(songs);
        return this;
    }

    public ListeningHistory addSong(Song song) {
        this.songs.add(song);
        return this;
    }

    public ListeningHistory removeSong(Song song) {
        this.songs.remove(song);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ListeningHistory)) {
            return false;
        }
        return getId() != null && getId().equals(((ListeningHistory) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ListeningHistory{" +
            "id=" + getId() +
            ", historyID=" + getHistoryID() +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
