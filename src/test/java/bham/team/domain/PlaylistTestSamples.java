package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class PlaylistTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Playlist getPlaylistSample1() {
        return new Playlist().id(1L).playlistID(1).name("name1").description("description1");
    }

    public static Playlist getPlaylistSample2() {
        return new Playlist().id(2L).playlistID(2).name("name2").description("description2");
    }

    public static Playlist getPlaylistRandomSampleGenerator() {
        return new Playlist()
            .id(longCount.incrementAndGet())
            .playlistID(intCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString());
    }
}
