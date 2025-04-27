package bham.team.domain;

import static bham.team.domain.AlbumTestSamples.*;
import static bham.team.domain.ArtistTestSamples.*;
import static bham.team.domain.EventTestSamples.*;
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
    void eventTest() {
        Artist artist = getArtistRandomSampleGenerator();
        Event eventBack = getEventRandomSampleGenerator();

        artist.addEvent(eventBack);
        assertThat(artist.getEvents()).containsOnly(eventBack);
        assertThat(eventBack.getArtist()).isEqualTo(artist);

        artist.removeEvent(eventBack);
        assertThat(artist.getEvents()).doesNotContain(eventBack);
        assertThat(eventBack.getArtist()).isNull();

        artist.events(new HashSet<>(Set.of(eventBack)));
        assertThat(artist.getEvents()).containsOnly(eventBack);
        assertThat(eventBack.getArtist()).isEqualTo(artist);

        artist.setEvents(new HashSet<>());
        assertThat(artist.getEvents()).doesNotContain(eventBack);
        assertThat(eventBack.getArtist()).isNull();
    }

    @Test
    void albumTest() {
        Artist artist = getArtistRandomSampleGenerator();
        Album albumBack = getAlbumRandomSampleGenerator();

        artist.addAlbum(albumBack);
        assertThat(artist.getAlbums()).containsOnly(albumBack);
        assertThat(albumBack.getArtist()).isEqualTo(artist);

        artist.removeAlbum(albumBack);
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
    void songTest() {
        Artist artist = getArtistRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        artist.addSong(songBack);
        assertThat(artist.getSongs()).containsOnly(songBack);
        assertThat(songBack.getArtist()).isEqualTo(artist);

        artist.removeSong(songBack);
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
