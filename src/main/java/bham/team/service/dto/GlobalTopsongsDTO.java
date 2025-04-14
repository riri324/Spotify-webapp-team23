package bham.team.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link bham.team.domain.GlobalTopsongs} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GlobalTopsongsDTO implements Serializable {

    @NotNull
    private Long id;

    @NotNull
    private String songTitle;

    @NotNull
    private String artistName;

    @NotNull
    @Min(value = 0)
    private Integer playCount;

    @NotNull
    private Instant monthYear;

    @NotNull
    @Min(value = 2000)
    @Max(value = 2100)
    private Integer year;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSongTitle() {
        return songTitle;
    }

    public void setSongTitle(String songTitle) {
        this.songTitle = songTitle;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public Integer getPlayCount() {
        return playCount;
    }

    public void setPlayCount(Integer playCount) {
        this.playCount = playCount;
    }

    public Instant getMonthYear() {
        return monthYear;
    }

    public void setMonthYear(Instant monthYear) {
        this.monthYear = monthYear;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GlobalTopsongsDTO)) {
            return false;
        }

        GlobalTopsongsDTO globalTopsongsDTO = (GlobalTopsongsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, globalTopsongsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GlobalTopsongsDTO{" +
            "id=" + getId() +
            ", songTitle='" + getSongTitle() + "'" +
            ", artistName='" + getArtistName() + "'" +
            ", playCount=" + getPlayCount() +
            ", monthYear='" + getMonthYear() + "'" +
            ", year=" + getYear() +
            "}";
    }
}
