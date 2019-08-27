# mebuie.github.io
Personal Website

# Dependencies
Include recommended file structure
    
    dgrid
    dijit
    dojo
    dojox
    dstore
    markos
        - Widgit
            - css
            - images
            - templates
        - Widgit.js
        - markos.css
        - system.json


Include links to all downloads. 

## Why Dojo?

Prominent framework in GIS. 

# Download and Installation
Clone or Download repository. 

Add appropriate css links / imports

    @import "markos/markos.css";

    var dojoConfig = {
        async: true,
        baseUrl: '.',
        packages: [
            'dojo',
            'dijit',
            'dojox',
            'dgrid',
            'dstore',
            'markos'
        ]
    };
 
# Get Started
Tutorial for creating your first markos.
 
The Desktop module with the system.json.

How it works now (localStorage) and why (no server) and that it could be used 
with a server
    
# Creating Software (Custom Widgets)
Talk about extending _SoftwareContainer