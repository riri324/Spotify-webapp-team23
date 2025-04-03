package bham.team.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserPreference.
 */
@Entity
@Table(name = "user_preference")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserPreference implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(max = 20)
    @Column(name = "favorite_genre", length = 20, nullable = false)
    private String favoriteGenre;

    @NotNull
    @Size(max = 50)
    @Column(name = "music_purpose", length = 50, nullable = false)
    private String musicPurpose;

    @Size(max = 50)
    @Column(name = "music_mood", length = 50)
    private String musicMood;

    @Size(max = 50)
    @Column(name = "vocal_preference", length = 50)
    private String vocalPreference;

    @Size(max = 50)
    @Column(name = "listening_time", length = 50)
    private String listeningTime;

    @Size(max = 50)
    @Column(name = "listening_pattern", length = 50)
    private String listeningPattern;

    @Size(max = 20)
    @Column(name = "song_length", length = 20)
    private String songLength;

    @Size(max = 50)
    @Column(name = "lyrics_importance", length = 50)
    private String lyricsImportance;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserPreference id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFavoriteGenre() {
        return this.favoriteGenre;
    }

    public UserPreference favoriteGenre(String favoriteGenre) {
        this.setFavoriteGenre(favoriteGenre);
        return this;
    }

    public void setFavoriteGenre(String favoriteGenre) {
        this.favoriteGenre = favoriteGenre;
    }

    public String getMusicPurpose() {
        return this.musicPurpose;
    }

    public UserPreference musicPurpose(String musicPurpose) {
        this.setMusicPurpose(musicPurpose);
        return this;
    }

    public void setMusicPurpose(String musicPurpose) {
        this.musicPurpose = musicPurpose;
    }

    public String getMusicMood() {
        return this.musicMood;
    }

    public UserPreference musicMood(String musicMood) {
        this.setMusicMood(musicMood);
        return this;
    }

    public void setMusicMood(String musicMood) {
        this.musicMood = musicMood;
    }

    public String getVocalPreference() {
        return this.vocalPreference;
    }

    public UserPreference vocalPreference(String vocalPreference) {
        this.setVocalPreference(vocalPreference);
        return this;
    }

    public void setVocalPreference(String vocalPreference) {
        this.vocalPreference = vocalPreference;
    }

    public String getListeningTime() {
        return this.listeningTime;
    }

    public UserPreference listeningTime(String listeningTime) {
        this.setListeningTime(listeningTime);
        return this;
    }

    public void setListeningTime(String listeningTime) {
        this.listeningTime = listeningTime;
    }

    public String getListeningPattern() {
        return this.listeningPattern;
    }

    public UserPreference listeningPattern(String listeningPattern) {
        this.setListeningPattern(listeningPattern);
        return this;
    }

    public void setListeningPattern(String listeningPattern) {
        this.listeningPattern = listeningPattern;
    }

    public String getSongLength() {
        return this.songLength;
    }

    public UserPreference songLength(String songLength) {
        this.setSongLength(songLength);
        return this;
    }

    public void setSongLength(String songLength) {
        this.songLength = songLength;
    }

    public String getLyricsImportance() {
        return this.lyricsImportance;
    }

    public UserPreference lyricsImportance(String lyricsImportance) {
        this.setLyricsImportance(lyricsImportance);
        return this;
    }

    public void setLyricsImportance(String lyricsImportance) {
        this.lyricsImportance = lyricsImportance;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserPreference)) {
            return false;
        }
        return getId() != null && getId().equals(((UserPreference) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserPreference{" +
            "id=" + getId() +
            ", favoriteGenre='" + getFavoriteGenre() + "'" +
            ", musicPurpose='" + getMusicPurpose() + "'" +
            ", musicMood='" + getMusicMood() + "'" +
            ", vocalPreference='" + getVocalPreference() + "'" +
            ", listeningTime='" + getListeningTime() + "'" +
            ", listeningPattern='" + getListeningPattern() + "'" +
            ", songLength='" + getSongLength() + "'" +
            ", lyricsImportance='" + getLyricsImportance() + "'" +
            "}";
    }
}
