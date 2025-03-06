package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PlaylistTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Playlist getPlaylistSample1() {
        return new Playlist().id(1L).name("name1").description("description1");
    }

    public static Playlist getPlaylistSample2() {
        return new Playlist().id(2L).name("name2").description("description2");
    }

    public static Playlist getPlaylistRandomSampleGenerator() {
        return new Playlist().id(longCount.incrementAndGet()).name(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
