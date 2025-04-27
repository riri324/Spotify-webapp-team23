package bham.team.domain;

import static bham.team.domain.PlaylistTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PlaylistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Playlist.class);
        Playlist playlist1 = getPlaylistSample1();
        Playlist playlist2 = new Playlist();
        assertThat(playlist1).isNotEqualTo(playlist2);

        playlist2.setId(playlist1.getId());
        assertThat(playlist1).isEqualTo(playlist2);

        playlist2 = getPlaylistSample2();
        assertThat(playlist1).isNotEqualTo(playlist2);
    }

    @Test
    void songTest() {
        Playlist playlist = getPlaylistRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        playlist.addSong(songBack);
        assertThat(playlist.getSongs()).containsOnly(songBack);

        playlist.removeSong(songBack);
        assertThat(playlist.getSongs()).doesNotContain(songBack);

        playlist.songs(new HashSet<>(Set.of(songBack)));
        assertThat(playlist.getSongs()).containsOnly(songBack);

        playlist.setSongs(new HashSet<>());
        assertThat(playlist.getSongs()).doesNotContain(songBack);
    }
}
