package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class GenreTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Genre getGenreSample1() {
        return new Genre().id(1L).genreID(1).songGenre("songGenre1");
    }

    public static Genre getGenreSample2() {
        return new Genre().id(2L).genreID(2).songGenre("songGenre2");
    }

    public static Genre getGenreRandomSampleGenerator() {
        return new Genre().id(longCount.incrementAndGet()).genreID(intCount.incrementAndGet()).songGenre(UUID.randomUUID().toString());
    }
}
