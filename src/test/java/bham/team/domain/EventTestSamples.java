package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class EventTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Event getEventSample1() {
        return new Event()
            .id(1)
            .description("description1")
            .title("title1")
            .artistName("artistName1")
            .venueName("venueName1")
            .city("city1")
            .region("region1")
            .country("country1");
    }

    public static Event getEventSample2() {
        return new Event()
            .id(2)
            .description("description2")
            .title("title2")
            .artistName("artistName2")
            .venueName("venueName2")
            .city("city2")
            .region("region2")
            .country("country2");
    }

    public static Event getEventRandomSampleGenerator() {
        return new Event()
            .id(intCount.incrementAndGet())
            .description(UUID.randomUUID().toString())
            .title(UUID.randomUUID().toString())
            .artistName(UUID.randomUUID().toString())
            .venueName(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .region(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString());
    }
}
