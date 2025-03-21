package bham.team.domain;

import static bham.team.domain.AlbumTestSamples.*;
import static bham.team.domain.ArtistTestSamples.*;
import static bham.team.domain.GenreTestSamples.*;
import static bham.team.domain.PlaylistTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SongTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Song.class);
        Song song1 = getSongSample1();
        Song song2 = new Song();
        assertThat(song1).isNotEqualTo(song2);

        song2.setId(song1.getId());
        assertThat(song1).isEqualTo(song2);

        song2 = getSongSample2();
        assertThat(song1).isNotEqualTo(song2);
    }

    @Test
    void albumTest() {
        Song song = getSongRandomSampleGenerator();
        Album albumBack = getAlbumRandomSampleGenerator();

        song.setAlbum(albumBack);
        assertThat(song.getAlbum()).isEqualTo(albumBack);

        song.album(null);
        assertThat(song.getAlbum()).isNull();
    }

    @Test
    void genreTest() {
        Song song = getSongRandomSampleGenerator();
        Genre genreBack = getGenreRandomSampleGenerator();

        song.setGenre(genreBack);
        assertThat(song.getGenre()).isEqualTo(genreBack);

        song.genre(null);
        assertThat(song.getGenre()).isNull();
    }

    @Test
    void artistTest() {
        Song song = getSongRandomSampleGenerator();
        Artist artistBack = getArtistRandomSampleGenerator();

        song.setArtist(artistBack);
        assertThat(song.getArtist()).isEqualTo(artistBack);

        song.artist(null);
        assertThat(song.getArtist()).isNull();
    }

    @Test
    void playlistsTest() {
        Song song = getSongRandomSampleGenerator();
        Playlist playlistBack = getPlaylistRandomSampleGenerator();

        song.addPlaylists(playlistBack);
        assertThat(song.getPlaylists()).containsOnly(playlistBack);
        assertThat(playlistBack.getSongs()).containsOnly(song);

        song.removePlaylists(playlistBack);
        assertThat(song.getPlaylists()).doesNotContain(playlistBack);
        assertThat(playlistBack.getSongs()).doesNotContain(song);

        song.playlists(new HashSet<>(Set.of(playlistBack)));
        assertThat(song.getPlaylists()).containsOnly(playlistBack);
        assertThat(playlistBack.getSongs()).containsOnly(song);

        song.setPlaylists(new HashSet<>());
        assertThat(song.getPlaylists()).doesNotContain(playlistBack);
        assertThat(playlistBack.getSongs()).doesNotContain(song);
    }
}
