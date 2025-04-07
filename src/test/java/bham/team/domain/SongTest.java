package bham.team.domain;

import static bham.team.domain.AlbumTestSamples.*;
import static bham.team.domain.ArtistTestSamples.*;
import static bham.team.domain.GenreTestSamples.*;
import static bham.team.domain.GlobalTopsongsTestSamples.*;
import static bham.team.domain.LikedSongsTestSamples.*;
import static bham.team.domain.ListeningHistoryTestSamples.*;
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
    void globalTopsongsTest() {
        Song song = getSongRandomSampleGenerator();
        GlobalTopsongs globalTopsongsBack = getGlobalTopsongsRandomSampleGenerator();

        song.addGlobalTopsongs(globalTopsongsBack);
        assertThat(song.getGlobalTopsongs()).containsOnly(globalTopsongsBack);
        assertThat(globalTopsongsBack.getSong()).isEqualTo(song);

        song.removeGlobalTopsongs(globalTopsongsBack);
        assertThat(song.getGlobalTopsongs()).doesNotContain(globalTopsongsBack);
        assertThat(globalTopsongsBack.getSong()).isNull();

        song.globalTopsongs(new HashSet<>(Set.of(globalTopsongsBack)));
        assertThat(song.getGlobalTopsongs()).containsOnly(globalTopsongsBack);
        assertThat(globalTopsongsBack.getSong()).isEqualTo(song);

        song.setGlobalTopsongs(new HashSet<>());
        assertThat(song.getGlobalTopsongs()).doesNotContain(globalTopsongsBack);
        assertThat(globalTopsongsBack.getSong()).isNull();
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
    void likedSongsTest() {
        Song song = getSongRandomSampleGenerator();
        LikedSongs likedSongsBack = getLikedSongsRandomSampleGenerator();

        song.setLikedSongs(likedSongsBack);
        assertThat(song.getLikedSongs()).isEqualTo(likedSongsBack);
        assertThat(likedSongsBack.getSong()).isEqualTo(song);

        song.likedSongs(null);
        assertThat(song.getLikedSongs()).isNull();
        assertThat(likedSongsBack.getSong()).isNull();
    }

    @Test
    void playlistTest() {
        Song song = getSongRandomSampleGenerator();
        Playlist playlistBack = getPlaylistRandomSampleGenerator();

        song.addPlaylist(playlistBack);
        assertThat(song.getPlaylists()).containsOnly(playlistBack);
        assertThat(playlistBack.getSongs()).containsOnly(song);

        song.removePlaylist(playlistBack);
        assertThat(song.getPlaylists()).doesNotContain(playlistBack);
        assertThat(playlistBack.getSongs()).doesNotContain(song);

        song.playlists(new HashSet<>(Set.of(playlistBack)));
        assertThat(song.getPlaylists()).containsOnly(playlistBack);
        assertThat(playlistBack.getSongs()).containsOnly(song);

        song.setPlaylists(new HashSet<>());
        assertThat(song.getPlaylists()).doesNotContain(playlistBack);
        assertThat(playlistBack.getSongs()).doesNotContain(song);
    }

    @Test
    void listeningHistoryTest() {
        Song song = getSongRandomSampleGenerator();
        ListeningHistory listeningHistoryBack = getListeningHistoryRandomSampleGenerator();

        song.addListeningHistory(listeningHistoryBack);
        assertThat(song.getListeningHistories()).containsOnly(listeningHistoryBack);
        assertThat(listeningHistoryBack.getSongs()).containsOnly(song);

        song.removeListeningHistory(listeningHistoryBack);
        assertThat(song.getListeningHistories()).doesNotContain(listeningHistoryBack);
        assertThat(listeningHistoryBack.getSongs()).doesNotContain(song);

        song.listeningHistories(new HashSet<>(Set.of(listeningHistoryBack)));
        assertThat(song.getListeningHistories()).containsOnly(listeningHistoryBack);
        assertThat(listeningHistoryBack.getSongs()).containsOnly(song);

        song.setListeningHistories(new HashSet<>());
        assertThat(song.getListeningHistories()).doesNotContain(listeningHistoryBack);
        assertThat(listeningHistoryBack.getSongs()).doesNotContain(song);
    }
}
