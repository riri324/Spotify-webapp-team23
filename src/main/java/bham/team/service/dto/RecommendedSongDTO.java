package bham.team.service.dto;

public class RecommendedSongDTO {

    private String trackName;
    private String artists;
    private String trackGenre;

    public RecommendedSongDTO() {}

    public RecommendedSongDTO(String trackName, String artists, String trackGenre) {
        this.trackName = trackName;
        this.artists = artists;
        this.trackGenre = trackGenre;
    }

    public String getTrackName() {
        return trackName;
    }

    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }

    public String getArtists() {
        return artists;
    }

    public void setArtists(String artists) {
        this.artists = artists;
    }

    public String getTrackGenre() {
        return trackGenre;
    }

    public void setTrackGenre(String trackGenre) {
        this.trackGenre = trackGenre;
    }
}
