package bham.team.domain;

import static bham.team.domain.AlbumTestSamples.*;
import static bham.team.domain.ArtistTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AlbumTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Album.class);
        Album album1 = getAlbumSample1();
        Album album2 = new Album();
        assertThat(album1).isNotEqualTo(album2);

        album2.setId(album1.getId());
        assertThat(album1).isEqualTo(album2);

        album2 = getAlbumSample2();
        assertThat(album1).isNotEqualTo(album2);
    }

    @Test
    void artistTest() {
        Album album = getAlbumRandomSampleGenerator();
        Artist artistBack = getArtistRandomSampleGenerator();

        album.setArtist(artistBack);
        assertThat(album.getArtist()).isEqualTo(artistBack);

        album.artist(null);
        assertThat(album.getArtist()).isNull();
    }

    @Test
    void songTest() {
        Album album = getAlbumRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        album.addSong(songBack);
        assertThat(album.getSongs()).containsOnly(songBack);
        assertThat(songBack.getAlbum()).isEqualTo(album);

        album.removeSong(songBack);
        assertThat(album.getSongs()).doesNotContain(songBack);
        assertThat(songBack.getAlbum()).isNull();

        album.songs(new HashSet<>(Set.of(songBack)));
        assertThat(album.getSongs()).containsOnly(songBack);
        assertThat(songBack.getAlbum()).isEqualTo(album);

        album.setSongs(new HashSet<>());
        assertThat(album.getSongs()).doesNotContain(songBack);
        assertThat(songBack.getAlbum()).isNull();
    }
}
