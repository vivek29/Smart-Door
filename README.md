# Implementing the Smart Door - See who’s there, from anywhere.

- The door to today’s home isn’t just about keeping the bad guys out. It’s also about letting the right people in—your family, friends, and even
favourite service providers. With the Smart Door, you are always in control of your front door, no matter where you are, right from your smartphone or computer.
You can be anywhere away from home and never miss a door visit from a guest ever again. With Smart Door, you will know who came to visit with the use of our 
camera system. With just the press of a button you can allow or deny the entrance of the visitor who came to your doorstep. You can allow anyone you trust
the access to your home without the need of giving them any keys or door codes that can be stolen or misused.

- In addition, Smart Door comes with its own automatic authorized entry system. Smart Door recognizes any pre-authorized individual and unlocks the door for
them to enter without any manual or controlled interaction. Just show your face and Smart Door will open the way. No more remembering to carry a key, which
can be lost or stolen. Smart Door let you in whenever you please. Entrance is just a door bell press away.

How it works - With the use of a doorbell button which will activate the peephole camera, one could see/monitor who’s there at the front door and unlock 
the door remotely. So, the camera will take snapshots, send it to the cloud and prompt the user to either unlock the door or deny it. The system will send
the prompt to the user's mobile application or web interface. An image of the visitor and a prompt asking to allow or deny entry will show up. The user can
then press either the option to allow or deny entry. If the user denies, then the door will remain locked and no entry will be permitted. If the user allows, 
then the door will be unlocked for the visitor to enter inside.

An automated system for easy entry for an authorized user is also in place. By using Facial Recognition, the system is made to recognize the face of the 
authorized user. When an authorized user rings the doorbell, the system takes the snapshot and see if it matches anyone who is authorized in the database.
If there is a match, the system will bypass the need for a user prompt and automatically unlock the door to allow entrance.


Technology Stack
 
*- Hardware
	Raspberry Pi
	Raspberry Pi Camera Module
	Push button
	Arduino with LCD Display (with RFs)


*- Software/Cloud
	Mosquitto Broker
	Python – Pi Code
	NodeJS – App Server Code, with following API Services - 
	•	Cloudinary – Cloud Image Service
	•	Kairos – Face Recognition and Analysis	
	•	GCM – to send notifications to Android App
	Android Application

 
**	Android App:
The app has following features:

1. User Enrollment
The user who owns the home needs to enroll first via a mobile app. He needs to take 5-6 pictures of his face in order make the facial recognition work.
Once enrolled, every time the home owner comes to the door and presses the door bell, his picture will be clicked, and send to Kairos service and perform
facial recognition. If the match is a success, the door will be unlocked.

2. Notification:
If someone else other than the people who are enrolled comes to the home and presses the door bell, then the image will be captured and send to cloud for
facial recognition. Here, there will be mismatch and this will trigger a notification with the image of the person to the actual registered user. Then based
on the image of the person the actual owner can make a decision to unlock the door or not. He can push the unlock button on his app and the door will be
unlocked. If the user denies then the door will remain locked.

**	Device/Raspberry Pi:
Raspberry Pi captures the image whenever the user presses the doorbell. The Raspberry Pi Cam is installed in the peep hole of the door. It saves the image
and publishes it to Mosquitto broker on cloud.

**	Cloud:
There are 3 important modules deployed on the cloud:

a) Mosquitto - MQTT Broker: The broker acts as a bridge between the NodeJS recognition service and mosquito. It pushes the image received from raspberry pi to
recognition service. When the user is not authenticated using the facial recognition, the request goes to Android App and the user decision is conveyed to
the raspberry pi through Mosquitto broker

b) Node JS Server: It has 2 service, User Enrollment and User Recognition service. The Enrollment service enrolls the user via the pictures clicked through
the Android App. The User Recognition service identifies if the user is enrolled or not. We use the Cloudinary service to store the images of the enrolled
users on the cloud, while Kairos service is used to enroll the user and do the facial recognition.

c) 3rd party services: We use Cloudinary Service API to store the image of the user during the enrollment phase. Kairos Service API takes up the images from
Cloudinary API and does the user enrollment on a gallery. During the recognition phase, the images from the raspberry pi camera are stored in Cloudinary API
and Kairos again uses it for recognizing.

--- Have a look at the Project2_Group4_Report for more information and setup images.
