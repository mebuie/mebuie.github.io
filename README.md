# mebuie.github.io
Welcome to MarkOS – my personal website and development playground. 

My personal website has always been primarily a medium to learn new skills and as a result, has gone through many iterations throughout the years. Starting out with Bootstrap 3, the site was rebuilt after learning how to create lightweight responsive websites without relying on bulky libraries. Today’s iteration departs from the usual scrolling website and leverages the Dojo framework to emulate an operating systems. 

The vision of this project is to create a web OS framework that anyone can use. 

# Why Dojo?
While it seems the community has long forgotten Dojo, it remains a prominent framework for GIS applications. Therefore, developing this website using the Dojo framework, will help keep me current in my career. 

# Dependencies
[Dojo 1.15](https://dojotoolkit.org)

[dgrid](https://dgrid.io/)

[dstore](https://dstorejs.io/)

# Download and Installation
Clone / Download repository or download dependencies manually. 

## Recommended file structure
    
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

## Setup
Include the following script in index.html to map the markos and dojo local installations. 

    <script>
        // Imports all CSS for markOS
        @import "markos/markos.css";

        // References the local instalation of the dependencies and markos root folder.
        // Assumes you followed recommended file structure. 
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
    </script>

Use the following script to instantiate markos

    <script>
        require([
            'markos/Desktop',
            'dojo/dom',
            'dojo/domReady!',
        ], function (
            Desktop,
            dom
        ) {
            var desktop = new Desktop();
            desktop.placeAt(document.body);
            desktop.startup();
        });
    </script>


# Getting Started (Coming Soon)
Tutorial for creating your first markos.
 
Explanation of the the Desktop module with the system.json.

How it works now (localStorage) and why (no server) and that it could be used 
with a server

# Widgets
[Desktop](https://github.com/mebuie/mebuie.github.io/tree/master/markos/Desktop) : The core module for markos.

[Clock](https://github.com/mebuie/mebuie.github.io/tree/master/markos/Clock) : Every OS needs a clock. Creates a system clock in the hotbar.  

[https://github.com/mebuie/mebuie.github.io/tree/master/markos/FileManager](https://dojotoolkit.org) : Provides a user interface to manage files and folders
    
# Creating Software (Coming Soon)
Extending _SoftwareContainer
- attribute for including template in header.
- attribute for including template in body.

Go over file structure and how js, html, css should be named the same thing

Go over system.json and uri should match widget name. 

CSS should start with baseClass to provide isolation. 

Need to discuss how you can FileViewer works. What arguments are required. 
How you can embed iframes using attachepoints. 
