package bham.team.domain;

import static bham.team.domain.GenreTestSamples.*;
import static bham.team.domain.SongTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import bham.team.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class GenreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Genre.class);
        Genre genre1 = getGenreSample1();
        Genre genre2 = new Genre();
        assertThat(genre1).isNotEqualTo(genre2);

        genre2.setId(genre1.getId());
        assertThat(genre1).isEqualTo(genre2);

        genre2 = getGenreSample2();
        assertThat(genre1).isNotEqualTo(genre2);
    }

    @Test
    void songsTest() {
        Genre genre = getGenreRandomSampleGenerator();
        Song songBack = getSongRandomSampleGenerator();

        genre.addSongs(songBack);
        assertThat(genre.getSongs()).containsOnly(songBack);
        assertThat(songBack.getGenre()).isEqualTo(genre);

        genre.removeSongs(songBack);
        assertThat(genre.getSongs()).doesNotContain(songBack);
        assertThat(songBack.getGenre()).isNull();

        genre.songs(new HashSet<>(Set.of(songBack)));
        assertThat(genre.getSongs()).containsOnly(songBack);
        assertThat(songBack.getGenre()).isEqualTo(genre);

        genre.setSongs(new HashSet<>());
        assertThat(genre.getSongs()).doesNotContain(songBack);
        assertThat(songBack.getGenre()).isNull();
    }
}
