package bham.team.web.rest;

import bham.team.domain.Feedback;
import bham.team.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackResource {

  private final FeedbackService feedbackService;

  @Autowired
  public FeedbackResource(FeedbackService feedbackService) {
    this.feedbackService = feedbackService;
  }

  @PostMapping
  public ResponseEntity<Feedback> createOrUpdateFeedback(@RequestBody Feedback feedback) {
    Feedback savedFeedback = feedbackService.saveFeedback(feedback);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedFeedback);
  }

  @GetMapping
  public ResponseEntity<List<Feedback>> getAllFeedback() {
    List<Feedback> feedbackList = feedbackService.getAllFeedback();
    return ResponseEntity.ok(feedbackList);
  }

  @GetMapping("/{id}")
  public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
    Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
    return feedback.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
    feedbackService.deleteFeedback(id);
    return ResponseEntity.noContent().build();
  }
}
