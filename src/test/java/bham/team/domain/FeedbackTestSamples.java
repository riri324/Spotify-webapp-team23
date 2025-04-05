package bham.team.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class FeedbackTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Feedback getFeedbackSample1() {
        return new Feedback()
            .id(1L)
            .feedbackId(1)
            .username("username1")
            .userEmail("userEmail1")
            .userPhineNum(1)
            .message("message1")
            .rating(1);
    }

    public static Feedback getFeedbackSample2() {
        return new Feedback()
            .id(2L)
            .feedbackId(2)
            .username("username2")
            .userEmail("userEmail2")
            .userPhineNum(2)
            .message("message2")
            .rating(2);
    }

    public static Feedback getFeedbackRandomSampleGenerator() {
        return new Feedback()
            .id(longCount.incrementAndGet())
            .feedbackId(intCount.incrementAndGet())
            .username(UUID.randomUUID().toString())
            .userEmail(UUID.randomUUID().toString())
            .userPhineNum(intCount.incrementAndGet())
            .message(UUID.randomUUID().toString())
            .rating(intCount.incrementAndGet());
    }
}
