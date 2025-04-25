package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ConcertTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Concert getConcertSample1() {
        return new Concert()
            .id(1L)
            .artistName("artistName1")
            .venueName("venueName1")
            .country("country1")
            .region("region1")
            .ticketmasterEventId("ticketmasterEventId1")
            .imageUrl("imageUrl1")
            .externalUrl("externalUrl1");
    }

    public static Concert getConcertSample2() {
        return new Concert()
            .id(2L)
            .artistName("artistName2")
            .venueName("venueName2")
            .country("country2")
            .region("region2")
            .ticketmasterEventId("ticketmasterEventId2")
            .imageUrl("imageUrl2")
            .externalUrl("externalUrl2");
    }

    public static Concert getConcertRandomSampleGenerator() {
        return new Concert()
            .id(longCount.incrementAndGet())
            .artistName(UUID.randomUUID().toString())
            .venueName(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .region(UUID.randomUUID().toString())
            .ticketmasterEventId(UUID.randomUUID().toString())
            .imageUrl(UUID.randomUUID().toString())
            .externalUrl(UUID.randomUUID().toString());
    }
}
