import { TestBed } from '@angular/core/testing';
import { MediaService } from './media.service';

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserMedia', () => {
    it('should return a Promise<MediaStream>', async () => {
      const mediaStream = await service.getUserMedia();
      expect(mediaStream).toBeInstanceOf(MediaStream);
    });
  });

  // describe('disableVideo', () => {
  //   it('should disable the video track of the given MediaStream', () => {
  //     const mediaStream = new MediaStream();
  //     const videoTrack = new MediaStreamTrack();
  //     spyOn(mediaStream, 'getVideoTracks').and.returnValue([videoTrack]);
  //     spyOnProperty(videoTrack, 'enabled', 'set');
  //     service.disableVideo(mediaStream);
  //     expect(videoTrack.enabled).toBe(false);
  //   });
  // });

  // describe('enableVideo', () => {
  //   it('should enable the video track of the given MediaStream', () => {
  //     const mediaStream = new MediaStream();
  //     const videoTrack = new MediaStreamTrack();
  //     spyOn(mediaStream, 'getVideoTracks').and.returnValue([videoTrack]);
  //     spyOnProperty(videoTrack, 'enabled', 'set');
  //     service.enableVideo(mediaStream);
  //     expect(videoTrack.enabled).toBe(true);
  //   });
  // });

  // describe('enableMic', () => {
  //   it('should enable the audio track of the given MediaStream', () => {
  //     const mediaStream = new MediaStream();
  //     const audioTrack = new MediaStreamTrack();
  //     spyOn(mediaStream, 'getAudioTracks').and.returnValue([audioTrack]);
  //     spyOnProperty(audioTrack, 'enabled', 'set');
  //     service.enableMic(mediaStream);
  //     expect(audioTrack.enabled).toBe(true);
  //   });
  // });

  // describe('disableMic', () => {
  //   it('should disable the audio track of the given MediaStream', () => {
  //     const mediaStream = new MediaStream();
  //     const audioTrack = new MediaStreamTrack();
  //     spyOn(mediaStream, 'getAudioTracks').and.returnValue([audioTrack]);
  //     spyOnProperty(audioTrack, 'enabled', 'set');
  //     service.disableMic(mediaStream);
  //     expect(audioTrack.enabled).toBe(false);
  //   });
  // });
});
