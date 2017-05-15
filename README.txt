
This project sets up a chat-room kind of architecture with the server (written in node) running somewhere accessible to all, and then (at least) 2 kinds of clients:
	1) "personal" - intended for multiple audience members,
	2) "Gallery" - intended for a single user who will send control signals to the audience. The gallery can also be used as a display in an installation setting, or the display/conductor roles could be split in to two different clients, as well.

To install, 
	a) clone this project from GitHub
	b) npm install - so that necessary node modules are installed. 

To run:
	1) On the server machine:
		node distributedPlatformServer.js portNum 
			or to keep it running in a shell even after you log out:
		nohup node distributedPlatformServer.js portNum &

	2) Navigate a browser to the gallery webpage:
		http://wherever.org:portNum/gallery.html
	3) Have audience navigate their browsers to the site:
		http://wherever.org:portNum


======================

File organization:

Root:
	disttributedPlaformServer.js   - the node server
	cert.key, cert.pem - not used - replace with your own certificates if you want to run a secure server
	runscripts/
		not used
	node_modules - library dependencies installed when you run 'npm install'

www/
	index.html - web page for the audience
	gallery.html - web page for the gallery
	utils/
		utils
	appscripts/   - This is where the action is for developers using this platform
		There are 3 files for the player (audience) and 3 for the gallery
			a) Main   - handles communications and i/o
			b) Display - handles drawing (and some coordination with player)
			c) Player  - handles sound generation
		
		There is a bunch of legacy (ok, let's call it example) code in each. 

=======

Notes:
	There should be no need to touch the server code.
	To send messages, it just call 
		comm.sendJSONmsg("your-msg-here", [array of anything to send as data with your message]);
	To receive messages:
		comm.registerCallback('your-msg-here', function(data) { ...})

	That is, the server doesn't need to know about your messages - just coordinate between sender and receiver. personals and gallery can both send and receive messages in the same way.

	All msgs are sent to everybody - just catch them and act on them as you wish. 
