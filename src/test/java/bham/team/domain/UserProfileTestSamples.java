package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class UserProfileTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static UserProfile getUserProfileSample1() {
        return new UserProfile().id(1L).studentId("studentId1").name("name1").age(1).profileImageUrl("profileImageUrl1").bio("bio1");
    }

    public static UserProfile getUserProfileSample2() {
        return new UserProfile().id(2L).studentId("studentId2").name("name2").age(2).profileImageUrl("profileImageUrl2").bio("bio2");
    }

    public static UserProfile getUserProfileRandomSampleGenerator() {
        return new UserProfile()
            .id(longCount.incrementAndGet())
            .studentId(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .age(intCount.incrementAndGet())
            .profileImageUrl(UUID.randomUUID().toString())
            .bio(UUID.randomUUID().toString());
    }
}
