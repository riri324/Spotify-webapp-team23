package bham.team.domain;

import static bham.team.domain.AlbumTestSamples.*;
import static bham.team.domain.ArtistTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ArtistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Artist.class);
        Artist artist1 = getArtistSample1();
        Artist artist2 = new Artist();
        assertThat(artist1).isNotEqualTo(artist2);

        artist2.setId(artist1.getId());
        assertThat(artist1).isEqualTo(artist2);

        artist2 = getArtistSample2();
        assertThat(artist1).isNotEqualTo(artist2);
    }

    @Test
    void albumsTest() {
        Artist artist = getArtistRandomSampleGenerator();
        Album albumBack = getAlbumRandomSampleGenerator();

        artist.addAlbums(albumBack);
        assertThat(artist.getAlbums()).containsOnly(albumBack);
        assertThat(albumBack.getArtist()).isEqualTo(artist);

        artist.removeAlbums(albumBack);
        assertThat(artist.getAlbums()).doesNotContain(albumBack);
        assertThat(albumBack.getArtist()).isNull();

        artist.albums(new HashSet<>(Set.of(albumBack)));
        assertThat(artist.getAlbums()).containsOnly(albumBack);
        assertThat(albumBack.getArtist()).isEqualTo(artist);

        artist.setAlbums(new HashSet<>());
        assertThat(artist.getAlbums()).doesNotContain(albumBack);
        assertThat(albumBack.getArtist()).isNull();
    }

    @Test
    void songsTest() {
        Artist artist = getArtistRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        artist.addSongs(songBack);
        assertThat(artist.getSongs()).containsOnly(songBack);
        assertThat(songBack.getArtist()).isEqualTo(artist);

        artist.removeSongs(songBack);
        assertThat(artist.getSongs()).doesNotContain(songBack);
        assertThat(songBack.getArtist()).isNull();

        artist.songs(new HashSet<>(Set.of(songBack)));
        assertThat(artist.getSongs()).containsOnly(songBack);
        assertThat(songBack.getArtist()).isEqualTo(artist);

        artist.setSongs(new HashSet<>());
        assertThat(artist.getSongs()).doesNotContain(songBack);
        assertThat(songBack.getArtist()).isNull();
    }
}
