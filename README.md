# Project I

In this project, you will work on a navigation stack similar to the one you created in tasks 41 and 42. The project has two stages and involves using the Camera API, Location API, Sensors API, File System, Navigation, and Media Player in React Native.

## Stage I

### Screen One: Title Camera
- Render a camera and a button that takes photos with it.
- When the user takes a picture, display it over the camera and ask the user if they want to save or discard it.
- If the user chooses to discard it, delete it from the device; otherwise, return to the camera for the user to take another picture.
- Unmount the camera when leaving the Camera page.

### Screen Two: Title Sensors
- Show the device's current location: Altitude, Longitude, Latitude, and Speed.
- Show the current device's X, Y, and Z orientation.
- Update the location's measurements every 10 seconds.
- Update the orientation measurements every 500 milliseconds.
- Stop the location and orientation sensors when leaving the Sensors page.

### Screen Three: Title Gallery
- Show a list of all the images captured by this app (that weren't discarded).
- Add a pull-to-refresh functionality.

### Screen Four: Title Slideshow
- Show a list of all the images captured by this app.
- Disable scrolling.
- Automatically scroll to the next element (and rotate to the first when the last is reached) every one second.
- Add a button to pause/resume the slideshow (stop the scrolling when it's enabled and resume it when it's disabled).

Create a GitHub repo called JoVision Project I Stage I.

## Stage II

### Screen One
- **Switch Camera Button:** Switch between the front and back camera.
- **Switch Mode Button:** Switch between video and photo capture.
- **Take Photo/Record Video Button:** Either take a single image or start recording a video depending on the selected mode. If the camera is recording a video and the button is pressed again, stop recording it.
- Name each captured image in the following manner: `YourName_CurrentDateAsISOString.mp4/jpg`.

### Screen Two
- Add an image of your choosing that depicts a car if the speed is more than speed X, a person walking if it's more than Y but less than X, and a person sitting if it's less than Y.
- Add an image that depicts the orientation of the device: Portrait, Right Landscape, Upside Down, and Left Portrait.
- Update the image every time the sensors make a new reading. Calculating the device's orientation from the sensor data is optional; you may use a community package to do this for you instead.
- Note: The image of cars, people, etc., can be icons instead of images.

### Screen Three: Title Gallery
- Show a list of all the images and videos captured by this app, with a pull-to-refresh functionality.
- When an image or a video is pressed, offer the following operations:
  - **Rename:** Rename the selected image to a name of your choice.
  - **Delete:** Delete the selected image from the device.
  - **Fullscreen:** Send the selected media to Screen Four and navigate to it.

### Screen Four: Media Viewer
- Hidden from the bottom tab navigator and only accessible through Screen Three.
- If the selected media is a video, play the video and add the following features:
  - Play/Pause the video.
  - 5 seconds forward.
  - 5 seconds rewind.
  - Next/Previous media file (could be an image or a video).
- If the selected media is a picture, show the image and add the following features:
  - Next/Previous media file (could be an image or a video).
