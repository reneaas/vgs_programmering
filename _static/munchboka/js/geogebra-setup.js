function setupGeogebra(containerId, options) {
    options.id = containerId + '-applet'; // Ensure unique ID for each applet

    var applet = new GGBApplet(options, true); // 'true' for using HTML5
    applet.inject(containerId); // This injects the applet into the container
}
