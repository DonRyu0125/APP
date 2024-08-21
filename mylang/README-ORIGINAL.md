<!-- ***************************
    
    NOTE:  THIS IS A MARKDOWN FILE.  Don't read it in a text editor because it will look like crap.
    Open up Google Chrome, and search for "Markdown Preview Plus", which is an Extension for Chrome.
    Download and install this extension, and then open up this file in Google Chrome, and it will 
    look like a proper HTML page.  

**************************** -->



# MINISIS - Online Data Entry Application
## M2A Online Edition

Written by Jon West - 2015

# Part One:  The Basics

## What the heck is all of this?
Welcome to the MINISIS Online Data Entry Application documentation.  Hopefully in reading through this mish-mash of words, you'll be able to figure out how the application works, and if you need to add something new, this should be a pretty decent set of blueprints to start from.  The start of this project was the third, (or fourth, depending on how you look at it) iteration of the M2A Online Application.  I wanted to create a framework for easily creating data entry applications using MINISIS databases.  I was able to achieve this through a series of abstractions and interfaces, heavily utilizing jQuery for its ability to work with XML data as well as the DOM easily and seamlessly.  

I wanted the process of creating worksheets online to be accessible to anyone with a basic knowledge of HTML, without having to worry about all of the markup and syntax for things like repeating fields and repeating group chrome (like selecting occurrences, etc).  For the most part, given my timelines, I feel like I was successful, however hindsight is always 20/20, and there may be things I've done which don't necessarily follow best practices.  I've tried to do things the best as I can, and if you're reading this because something crapped out and you're totally lost in my code, I'm sorry.  This document, long as it is, should give you the jist of where I was coming from, and should provide a pretty good idea as to how things are working beneath the hood.  If not, oh God, that's terrible news, because it took literally *forever* to write.

## Requirements:
  - jQuery v1.9.1 or higher (but probably not jQuery 2.x.x, stick to the 1.9.x branch)
  - jQuery UI v1.10.2 or higher (used for datepicker and other various functionality)
  - Colorbox v1.4.21 or higher (used for modal windows)
  - jQuery ToolTipster v3.2.6 (optional - for form tooltips)
  - momentJS 2.10 or higher (used for handling date parsing)
  - jQuery Cookie 1.3.1 (used for handling MINISIS cookies)
  - A healthy dose of sanity, and even more patience







# Part Two:  The JavaScript

## File Explanation:
Honestly, there are a *lot* of files in this repo you honestly won't ever need to touch because they've been packaged along with the current iteration of M2A Online in order to make *it* work, and won't necessarily be required for the version *you're* working on (if you're creating something new, like M2A Online).  The most important directory is your `assets/js` folder, which contains *all* of the logic required to make this application work.  The HTML files, while handy for using as a quick reference for syntax, are for the most part aesthetic, and the application itself should work with whatever HTML files you want to use, so long as they follow the required HTML syntax (which, don't worry, is described in this document in detail).

With that being said, let's start with the most core file, `assets/js/dataentry/record_handling.js`.

### File `assets/js/dataentry/core_record_handling.js`:
This file contains all of the core logic for dealing with the XML files that are served up by MINISIS.  If you all you had was a single HTML page with an XML element from MINISIS and a form field for submission, you could handle all of the data manipulations for a record from the javascript command line using this file.

It handles:
  - **element retrieval**
  - **group retrieval**
  - **adding new elements and groups**
  - **modifying existing elements and groups**
  - **getting occurrence counts**
  - **renaming elements and groups**
  - **removing elements and groups**
  - **moving group and repeating field occurrences**
  - **mapping existing fields and groups to new mnemonics** (for validated tables)
  - **checking for active restrictions**
  - **returning an XML copy of the data** (for debugging)

It is passed a single parameter, a **string** representing the unique identifer in the DOM for getting the MINISIS XML element.  An example of this would be, `'xml#MY_XML'` for the current M2A Online installation.


### `core_record_handling` Functions
- `Record#getGroup`
  - `getGroup` takes two required parameters, `g_id`, which is a string representing a group's ID (lowercase), and `occurrence`, which is a group's occurrence number.  `getGroup` also takes one optional parameter, `parent_group`, which becomes a required parameter if the group is a nested group, otherwise `parent_group` defaults to being the root of the record.  The point of `getGroup` is to locate a group within a record's XML, and return that group XML to the function caller.  If no suitable group is found, the function returns `false`.

- `Record#addGroup`
  - `addGroup` is used to add a group to the record XML.  It takes two required parameters, `g_id`, which is a string representing a group's ID (lowercase), and `occurrence`, the group's occurrence number, as well as one semi-optional parameter, `parent_group`.  If `parent_group` is not specified, it will default to the root of the record.  Basically what the function does is check if the group already exists, in which case only an *occurrence* of the group needs to be created.  If the group *doesn't* exist, then it will first create the "container" group (ex. `<some_group>`), and then create the first occurrence of that group (ex. `<some_group_occurrence occ="1">`), which is the standard MINISIS XML format for a group.  Once the group has been added to the record, the function returns `true`.

- `Record#getElement`
  - `getElement` is used to get an element from the record.  This could be an elementary field, or a repeating field.  Like the `getGroup` function, it takes one optional, and two semi-optional parameters.  `e_id` is a lowercase String representing the element's ID in the XML.  `occurrence` is used to determine whether a field is elementary or repeating.  In the case of an elementary field, `occurrence` should be `0`.  The reason that this is not an optional parameter, is because if an elementary field is located within a repeating group, there would be no reliable way to determine whether the second parameter would be an occurrence, or a parent group.  The function will first "sanitize" the group ID (just make it lowercase), and then determine whether the element is repeating or not by checking for the presence of the group's ID with `_occurrence` after it, which would be present if the field was repeating.  Once that's been determined, the function find's the appropriate element and returns it to the function caller.

- `Record#getOccurrenceCount`
  - `getOccurrenceCount` takes two parameters, the field/group's `id`, as well as the `element_parent`, which is a jQuery object representing the element's parent in XML format.  If `element_parent` is not provided, the function will default to the root of the record.  The function then returns an integer with the amount of elements matching `id` with `_occurrence` after it, which determines the amount of occurrences a repeating field/group has.

- `Record#addElement`
  - `addElement` takes four parameters:  `element_name`, which is a String value representing the desired element name (ex. `new_field`), `element_value` which is a String value representing element's value (ex. `Test Value`), `element_is_repeating` which is a Boolean value for whether the field is repeating or not (ex. `false`), and then `element_parent` which is a jQuery object representing the element's desired parent in XML format.  If not specified, `element_parent` defaults to the root `<record>`.  This function uses jQuery's native XML handling to create an XML element which is a representation of the MINISIS field and then it will append that value to the `element_parent`.  When the element has been successfully added, the function will return `true`.

- `Record#updateElement`
  - `updateElement` takes two parameters--`element`, which is a jQuery object representing the element to be updated in XML format, and the `new_value` for that element, which is a String.  The easiest way to get `element` is to use the `getElement` function, as that's how the function is used throughout the application, and it works very well.  Note that this function is a *destructive function*, and that previous values are not kept.  Once the function has been called, that will be the value of that field in the current session, until the user either cancels all edits, or saves the changes.  Once the element has been updated, the function returns `true`.

- `Record#renameElement`
  - `renameElement` takes two parameters--`element`, which is a jQuery object representing the element to be updated in XML format, and the `new_name` for that element, which is a String.  This function is used mainly by the `remap` function to help correctly rename elements from other databases.  Basically what this function does is to create a shadow copy of the previous element with a new name, and then replace the previous element with the new element.  If the element has any children, then they will *not* be renamed.  How it works in this case is that a new empty element will be created with the new name, and then all of the children of the original element will be added to the new element, and *then* the original element is replaced.  In the case of a repeating field/group being named, the function will create a new element with the new name (and original attributes), and then create a new child element (for example `<new_name_occurrence occ="1">`) with the appropriate occurrence information.  Once this has happened, the function will return `true`.

- `Record#removeElement`
  - `removeElement` takes a single parameter, `element`, which is a jQuery object representing the element to be removed in XML format.  Now, while you'd think that removing an element would be as simple as removing the node from the XML, this *doesn't work*, because if you don't submit an element in a MINISIS form POST, MINISIS will assume that either a) the field should be populated by a MINISIS routine, or b) nothing in the field/group has changed, and so it doesn't need to be updated.  Instead, what needs to happen is that every value within a given element, whether it's a group or a field, needs to only contain an empty String.  So, this function traverses the given element's DOM and any node with any text in it gets replaced with an empty string.  When that process is finished, the function will return `true`.

- `Record#removeGroupOccurrence`
  - `removeGroupOccurrence` takes a single parameter, a jQuery object representing the `group` to be removed in XML format.  To be honest, in looking through this after having wrote it a while back, I can't figure out why I wrote this when `removeElement` should do the same thing.  This looks to be pretty much identical to `removeElement` with an added condition of checking if the the group's parent is `record` (so as to not clear everything in a record when the function is called on an elementary field).  If you're writing new functionality, I would recommend refactoring this function to use `removeElement`, but keeping it in order to maintain legacy compatibility.

- `Record#moveOccurrence`
  - `moveOccurrence` takes two parameters, `occurrence`, which is jQuery object representing the occurrence of the field/group to be moved in XML format, and `new_position` which is a number value for the desired occurrence position.  It basically just utilizes the jQuery DOM manipulation functions `insertBefore` and `insertAfter` to move the `occurrence` within its parent.  Once the *actual* move has happened, then `Record#sortOccurrences` (see below) is called in order to replace the MINISIS `occ` parameters so that they are in order.  When this has happened, the function will return `true`.

- `Record#sortOccurrences`
  - `sortOccurrences` takes two parameters, `group_name`, which is a String representing the group to be sorted, and `group_parent` which is a jQuery object representing the group's parent in XML format.  All this function does is find the desired group within a group's parent, and then for each of its children (occurrences), it will replace the existing occurrence number with the element's current occurrence position in the XML, thus "sorting" it when it's submitted back to MINISIS.

- `Record#remap`
  - Real talk--`remap` was the most frustrating function to write and debug in this entire application.  The point of `remap` is to take a set of data, and then using a `map` (see `params.maps` for more explanation), rename all of the relevant nodes to fit into the new place in the database.  For example, you might bring in multiple People records into a Collections record in different places, so it's not enough to just bring in a People record verbatim, or there would be multiple references to `PERSON_ID`, but they would all be pointing to different fields, so there'd be no way to determine which the intended `PERSON_ID` was.  Instead, we'll set up the map so that each instance of `PERSON_ID` brought into a group/field in Collections will be unique.  For this, we need to first get all of the relevant data from the Person record, which will still have all of the same mnemonics as the actual People record.  This is passed to the function as the first parameter, `loaded_xml`.  Another variable is created (`relevant_data`), a jQuery object in XML format, which will hold all of the relevant data in XML format from the People database.  Then the function will go through each of the mnemonics listed in the `map`, the second parameter.  This `map` is a JSON object where the `key` is the original mnemonic (from the People database), and the `value` is the desired mnemonic (for the Collections database).  If the relevant mnemonic is found within the `loaded_xml`, it is added to `relevant_data`.  Once `relevant_data` is populated, each of the nodes within `relevant_data` are renamed to the mnemonics that will be used in the Collections database using the `rename_element` function.  After that's been done, the function goes through the `parent_group` looking for any data that will conflict with the data that's to be mapped in.  When that completes, the function goes through the `relevant_data` object a final time looking for *any* child nodes which are not a part of the map (irrelevant child nodes, mostly), and if any nodes which are not a part of the map are found, they are removed.  Once that's complete, each of the children of the `relevant_data` object are added to the parent group.  After all of that is complete, the remapped data is successfully a part of the `parent_group`, and the function returns `true`.

- `Record#returnAsRepeatingField`
  - `returnAsRepeatingField` is used by the `remap` function in order to provide the proper database structure to the record which the validated table record is being loaded into.  If in the validated table database a field is an elementary field stored within a repeating group, but, for some reason the field is a repeating field in the new record, this function will take the element and return it as a repeating field.  To be honest, I'm really not sure why you wouldn't just normalize the data between databases, but this is what I was asked to do, and after speaking my piece it was still requested, so I did it.  This function is passed an `element_array`, which is every instance of the field from the repeating group inside an array.  A new element is created with the matching mnemonic, and then for each member of the passed array, a new element is created with `_occurrence` after the mnemonic (to fit with the MINISIS repeating field syntax).  Once the repeating field element has been created and populated, it is passed back to the calling function.

- `Record#hasActiveRestrictions`
  - `hasActiveRestrictions` does not require any passed parameters.  It will traverse the current record looking for the restrictions mnemonic (as defined in `params.restriction_mnemonic`), and each restriction is pushed into an array.  Next, the function checks if the value `Active` is present in the array (aka. are there any active restrictions?) and if there are any active restrictions, the function returns `true`, otherwise the function will return `false`.

- `Record#getXML`
  - `getXML` is used for debugging purposes to get an idea as to what's contained within a record.  It returns a copy of the record as a jQuery object in XML format.  You could also just view the record in the DOM using Chrome's Developer Tools (which is honestly what I usually did) by typing something like `$('xml').find('record');`, which would do the same thing, though *this* method returns the *exact* record, so changes to this object will be destructive, whereas using `getXML` isn't.

- `Record#prepareSubmission`
  - `prepareSubmission` is used to prepare and return an HTML form that is ready for submission to MINISIS after being assigned an `action` attribute, which is handled within `ApplicationInterface` rather than `Record`.  It is passed two parameters, which are not needed on the first call of the function, only when the function recursively calls itself.  First, there is a variable `ignored_mnemonics` which is an array of strings, and any mnemonic that's contained within this array *won't* be submitted.  The reason that you'd not want to submit any values is to let MINISIS handle the processing of certain fields, or to prevent submission of fields that are used by the application, but not the database, like `accession_number2`.  Basically what this function does is takes every node within a record and generate a hidden `input` form element.  The value of that element is going to be the value of the node, and the form `name` is going to be equal to the nodes position within the record concatenated with the mnemonic name.  The group names are not submitted with the field, but their occurrence *is*.  So for a field `test_field`, which is an elementary field contained within the second occurrence of a group, the generated mnemonic will be `test_field$1$2`.  Note that if a field is contained within a group, regardless of whether it is elementary or repeating, it needs an "occurrence", so elementary fields within groups will always be in the format `field_mnemonic$1$<group occurrence>`.  For the second occurrence of a repeating field `field_mnemonic` contained within the first occurrence of a repeating group, the generated mnemonic would be `field_mnemonic$2$1`.  The generated mnemonic format is most specific occurrence (the field occurrence) to least specific occurrence (furthest parent group).  Technically speaking, you could submit a field nested within like 15 groups--though this would be ugly as hell on the visible form, from the functions standpoint, if it had a value, it should be able to submit without issue.


-------------------------------------



### File `assets/js/dataentry/record_databases/*.js`:
Every file in the `databases` folder is going to be named `<database_name>.js` where `database_name` is, strangely enough, the name of the database that the file applies to.

Each of these files inherits from the `record_handling.js` file, so all of the core functionality that applies to a record will be included by default into each of the specific database files.

The role of these files is to separate the database specific logic into their appropriate parts to keep the core functionality of the system from getting cluttered, affecting the maintainability of the code.

For example, in the current M2A Online application, in the collections database, there is 'movement' functionality, which allows users to set the current location of an object in the database.  This functionality doesn't apply to a database like 'people', so there is no point to put it in the `record_handling.js` file.

Several databases have the concept of restrictions, but they could all handle it in different ways.  A core set of functionality could be implemented in `record_handling.js` but then extended in the database file to keep things lean and modular.

The other thing that each of these database files will contain is a variable called `params`.  `params` includes several properties which are used throughout the application.

The most important one of these parameters is the `maps` parameter.  For every validated field and validated table where data must be ported from one database into another, this maps parameter will be referenced.  This is setup as a JavaScript object, which contains a JavaScript array, which contain JavaScript objects.

The format is:

`'map_name' : [{'key': 'validated_table_field',   'value': 'field_in_current_database' }]`

The `map_name` refers to how the map is to be referenced in the HTML.  The naming of this is arbitrary, but must follow JSON variable naming rules.  If you decided to call your map `diddly_dogs`, that's totally fine--it doesn't need to be set up anywhere inside of the SMA, it's strictly for the online application.  The array that follows contains any number of JavaScript objects which will follow this exact format.

The first property must be `key`, and hold a String value of the database field mnemonic as it exists in the validated table database, so for example, if you were pulling in an organization's name from the ORG_VAL database, this value would be `org_main_body`.

The second property must be `value`, and hold a String value of the database field mnemonic as it exists in the *current* database, so if you were putting that same `org_main_body` field from Organizations into Collections, the value of this might be `acq_source_org`.



-------------------------------------



### File `assets/js/dataentry/record_databases/collections.js`:
There are only a handful of collections specific functions for record handling, detailed below:

 - `CollectionRecord#hasComponents` will return a Boolean value based on whether or not the currently loaded record contains any components
 - `CollectionRecord#getComponents` will return a jQuery object containing all of a records components in XML format.
 - `CollectionRecord#getComponent` will return a jQuery object containing a *specific* component in XML format based on the occurrence parameter passed (an integer)
 - `CollectionRecord#componentCount` will return an Integer based on the number of components a record has.
 - `CollectionRecord#getPrimaryImage` will return a JavaScript object containing the record's primary image URL as well as its caption



-------------------------------------



### File `assets/js/dataentry/record_databases/loans.js`:
Loans, like Collections, only has a handful of specific functions for record handling, detailed below:

 - `LoanRecord#hasCosts` will return a Boolean value based on whether or not the currently loaded record contains any loan costs
 - `LoanRecord#getCosts` will return a jQuery object containing all of a records loan costs in XML format.
 - `LoanRecord#getCost` will return a jQuery object containing a *specific* component in XML format based on the occurrence parameter passed (an integer)
 - `LoanRecord#getCostsCount` will return an Integer based on the number of loan costs a record has.


-------------------------------------



### File `assets/js/dataentry/record_databases/organizations.js`:
Organizations only has a single specific function, `OrganizationRecord#setDefaultAddress`, which calls the `Record#remap` function to set an organization's current (default) address.  It takes a single parameter, `new_default_address_group`, which is obtained using the `Record#getGroup` function as it is a jQuery object containing an XML representation of the address the user would like to set as the default address.



-------------------------------------



### File `assets/js/dataentry/record_databases/people.js`:
People only has a single specific function, `PeopleRecord#setDefaultAddress`, which calls the `Record#remap` function to set an person's current (default) address.  It takes a single parameter, `new_default_address_group`, which is obtained using the `Record#getGroup` function as it is a jQuery object containing an XML representation of the address the user would like to set as the default address.




-------------------------------------



### File `assets/js/dataentry/core_interface_handling.js`:
This file is the bridge between your HTML, and the XML data.  Whereas `record_handling.js` deals *only* with the XML data, `interface_handling.js` handles the **logic** between the HTML form, and the calls made to populate and manipulate the data that's displayed on that form.  There is *no user involvement*, and *no event handling* included in this file.

It handles:
  - **initial population of the HTML forms**
  - **population of individual group and field data**
  - **finding an element or group's parent element based on the HTML**
  - **clearing group and/or field data**
  - **manipulating occurrence numbers in the HTML based on the XML data**
  - **updating XML data based on the HTML data**
  - **displaying and handling repeating field/group occurrence manipulation to the user** (moving and removing group/field occurrences)

It is passed *one required*, and *one optional* parameter.  The required parameter, `record`, is an instance of the `Record` class (from `core_record_handling.js`), and the optional parameter, `params`, is a javascript object with keys and values related to the views associated with the application.

#### `params` Parameters:
  - `form_container` : The unique DOM identifier for the highest relevant DOM element which contains all of your record's form elements.  
  - `overlay` : The unique DOM identifier for an HTML element used as an overlay when the repeating occurrence menu is displayed.
  - `group_title` : The DOM identifier for finding a group's title.
  - `group_container` : The DOM identifier for every group's parent element.
  - `group_occurrence` : The DOM identifier for every group's 'current occurrence' count
  - `group_total_occurrences` : The DOM identifier for every group's 'total occurrences' count
  - `r_field` : The DOM identifier for every repeating field's input element
  - `r_field_container` : The DOM identifier for every repeating field's parent element
  - `r_field_occurrence` : The DOM identifier for every repeating field's 'current occurrence' count
  - `r_field_total_occurrences` : The DOM identifier for every repeating field's 'total occurrences' count
  - `context_menu` : The unique DOM identifier for the repeating occurrence manipulation menu
  - `record_image` : The unique DOM identifier for a record's default image in the HTML
  - `image_virtual_directory` : A string representing the MINISIS virtual directory images are kept in
  - `image_url_path` : A URL for where the MINISIS virtual directory maps to
  - `contains_image` : Element selector for elements containing an image
  - `base_url` : The base URL for the application
  - `sessid` : A cookie value for the home session ID.
  - `valtable_view_links` : An object containing the beginning of a URL to retrieve a system report from a validated table record
    - `m3` : The view link for an M3 record
    - `org` : The view link for an Organization record
    - `people` : The view link for a People record
    - `loc` : The view link for a Location record
    - `event` : The view link for an Event record
    - `restrictions` : The view link for a Restriction record

  - `valtable_query_links` : An object containing the URL to perform a query on a validated table database
    - `m3` : The query URL for M3 records
    - `org` : The query URL for Organization records
    - `nomenclature` : The query URL for Nomenclature (Chenhall) records
    - `people` : The query URL for People records
    - `loc` : The query URL for Location records
    - `event` : The query URL for Event records
    - `restrictions` : The query URL for Restrictions records

This parameter variable (params), is then copied to `this.interface_params`, so that its values can be accessed by outside functions without being manipulated.

#### `core_interface_handling` Functions
- `ApplicationInterface#populateForm`
  - `populateForm` does exactly what you'd expect it to do.  It's going to go through the currently displayed HTML data entry form, and find every instance of a "group", and "field", and for each "group", it will find every containing "field", and populate the value of that based on the currently loaded XML data from `core_record_handling.js` functions.  This function also handles loading in a record's "default image", which is just the first occurrence from the `IMAGE_REF_GROUP` group.

- `ApplicationInterface#populateGroup`
  - `populateGroup` is called from `populateForm` when `populateForm` encounters a "group".  It takes two parameters, the `group_id`, and the `occurrence` of the group.  First the function goes to the `core_record_handling.js` function for retrieving a group's XML data.  If the data is successfully returned, the function will replace the appropriate text in the DOM for which occurrence (and how many total occurrences) are displayed.  If there are any subgroups contained within a group, the function is recursively called on those groups as well.  When every child group has been populated, the function goes through and finds every field contained within that specific occurrence of the group, and calls `ApplicationInterface#populateField` on those fields.  For any form field which does not contain XML data in that occurrence, the field is cleared.

- `ApplicationInterface#populateField`
  - `populateField` is called from both `populateForm` and `populateGroup`.  It takes two parameters, the `field_id`, which is the field's ID in the DOM, and `occurrence`, which is either going to be an occurrence number in the case that the field is repeating, or a `0` if the field is an elementary field.  It works by getting the XML data from `core_record_handling.js` functions, and if that data exists, it is placed into the appropriate form element in the DOM.  In the case of checkboxes, because the application replaces native browser checkboxes with icons, the function replaces the appropriate icon as well.  If the field is repeating, this function will also replace the text that lets the user know which occurrence is currently displayed, as well as how many occurrences are available.

- `ApplicationInterface#getGroupParent`
  - In order to get an occurrence of a nested group, a parent group is required.  Following the group's ancestry through the DOM was the easiest method of doing this, and that's what this function will do.  Basically, if you have a group like:
    - `PARENT_GROUP`
      - `PARENT_GROUP_OCCURRENCE 1`
        - `CHILD_GROUP`
          - `FIELD 1`
      - `PARENT_GROUP_OCCURRENCE 2`
        - `CHILD_GROUP`
          - `FIELD 1`

  - In order to determine which `FIELD 1` to load, you can't just search for `CHILD_GROUP`, because you would get two results, you need to get the `CHILD_GROUP` from `PARENT_GROUP_OCCURRENCE 1`, for example, and so to find that parent in the XML, the function traverses the DOM to get the appropriate parents.  It works by checking to see the number of 'group' parents that a DOM element has.  If the number of parents is 0, the field is an elementary field at the root of the record (for example, `SISN` or `ACCESSION_NUMBER`).  If the number of parents is greater than 0, it will be recursively called using the occurrence information visible in the DOM until the closest parent group occurrence is found.  When the appropriate parent XML data is found, it is returned to the calling function as a jQuery XML object.

- `ApplicationInterface#getTotalOccurrences`
  - `getTotalOccurrences` takes a single `id` parameter, which is an element's (either a field or group) ID in the DOM.  It returns an integer value of how many occurrences a field or group has in the XML.

- `ApplicationInterface#getCurrentOccurrence`
  - `getCurrentOccurrence` takes a single `id` parameter, which is an element's (either a field or group) ID in the DOM.  It returns an integer value of the currently loaded occurrence's place in the XML.

- `ApplicationInterface#occurrenceExists`
  - `occurrenceExists` takes two parameters, the `element_id`, which is the element's ID in the DOM, as well as an `occurrence` number.  It's job is to determine whether the element is a field or a group, and then to call the appropriate function in `core_record_handling.js` to determine whether data exists in the specified occurrence or not.  It returns a Boolean value based on whether or not data was found or not.

- `ApplicationInterface#isRepeatingField`
  - `isRepeatingField` takes a single parameter, the `field_id`, which is the field's ID in the DOM, and returns a Boolean value depending on whether or not the field is contained within `params.r_field_container` (which is the DOM selector for a repeating field).

- `ApplicationInterface#isInGroup`
  - `isInGroup` takes a single parameter, the `element_id`, which could be either a field's ID, or a group's ID in the DOM, and returns a Boolean value depending on whether or not the element is a child of a group element.  The original intent of this function was to determine whether a field was in a group, but the logic works for checking if a group is a child of another group as well.

- `ApplicationInterface#groupIsPopulated`
  - `groupIsPopulated` takes a single parameter, the `group_id`, which is a group's ID in the DOM, and returns a Boolean value depending on whether there are any fields contained within the group which hold a value.

- `ApplicationInterface#clearGroup`
  - `clearGroup` takes a single parameter, the `group_id`, which is a group's ID in the DOM, and what it does is go through and remove values from any form fields contained within the group, effectively resetting it.

- `ApplicationInterface#resetOccurrences`
  - `resetOccurrences` takes a single parameter, the `element_id`, which is a group or field's ID in the DOM, and what it does is resets all of the displayed occurrence values to '1', so when a new form is loaded, all of the occurrences say "1 of 1" instead of "0" or whatever had been previously loaded.

- `ApplicationInterface#handleImages`
  - `handleImages` doesn't take any parameters.  It calls the `Record#getPrimaryImage` function to get a record's primary image, and if that image is present, replaces the "primary image" on Collections data entry forms with that image, or if an image is *not* present, will replace it with an appropriate placeholder image.

- `ApplicationInterface#getPreviousGroupOccurrence`
  - `getPreviousGroupOccurrence` is called from `core_interaction_handling.js`, and is passed a single parameter, `calling_field`, which is a jQuery object of the element which called `getPreviousGroupOccurrence`.  In the majority (if not all) of cases, this will be the button that a user pressed in order to get the previous occurrence, so first the function uses that element's position in the DOM to determine which group the function was called for.  If the *current* group occurrence is greater than 1, the function calls `ApplicationInterface#populateGroup` in order to populate the group with the appropriate occurrence data, otherwise, the function returns `false`, which basically doesn't do anything as nothing needs to be done.

- `ApplicationInterface#getNextGroupOccurrence`
  - `getNextGroupOccurrence` works in the same way that `getPreviousGroupOccurrence` works, only it performs a few additional checks.  For getting the next occurrence of a group, the current occurrence needs to be less than the total occurrences, *or* the current occurrence needs to be *equal* to the total number of occurrences, *and* have at least one of the containing fields populated.  This further check is put in place to handle adding a new occurrence to a group.  If a new occurrence is added, basically what happens is that the group is cleared out, and when the user enters something into a field, `updateField` handles adding that occurrence to the parent group.  If the user goes to create a new occurrence but enters nothing, no new occurrence is created in the XML.

- `ApplicationInterface#getPreviousFieldOccurrence`
  - See `ApplicationInterface#getPreviousGroupOccurrence`, as `getPreviousFieldOccurrence` is handled in the same way.

- `ApplicationInterface#getNextFieldOccurrence`
  - `getNextFieldOccurrence` is handled in much the same way that `getNextGroupOccurrence` is handled, with the exception of a few rules.  For getting the next occurrence of a repeating field, this function will also check to make sure that the field is not read only (from a validated table), *but* if the field *is* read only but the field is from a pick list (like "Entered By"), *or* a File Upload type field, then the user will be allowed to add another occurrence.

- `ApplicationInterface#updateField`
  - `updateField` is called by `core_interaction_handling.js`, and is called when someone changes a field on a data entry worksheet.  It takes a single parameter, `calling_field`, which is a jQuery object representing the field that a user has entered.  The way it works is that it checks to see if the field already has a value, and if it does, it will replace the existing value with the value which is currently on the form (ie. the changed value).  If the field doesn't exist, it will be created.  If the field is within a group which has does not exist, the group will also be created along with the field.

- `ApplicationInterface#contextMenu`
  - Repeating fields, and repeating groups both need a way to move and remove occurrences.  This is provided by the `contextMenu` function, which builds and appends a right-click context menu for performing these operations.  Note that this function *only builds the menu*, it *does not* handle actually performing these tasks.  Basically, from a bird's eye view of the function, it's going to create an overlay, then a `<ul>` element containing two options--move, or remove an occurrence.  The `<ul>` also has a few parameters, `current_occ`, which is the current occurrence of a group/field, `total_occ`, which is the total number of occurrences, `element` which contains the ID of the field/group, and `fld_type`, which will either be equal to `field` or `group`.

- `ApplicationInterface#clearContextMenu`
  - `clearContextMenu` handles removing an existing context menu from the DOM, as well as removing the `relative` class from the calling element, which is added for positioning reasons, and unnecessary if there is not an attached context menu.  Basically, it just hides the elements in the DOM, and once they are hidden, removes them completely.

- `ApplicationInterface#removeOccurrence`
  - `removeOccurrence` takes a single parameter, `calling_field`, which is a jQuery object representing the "remove occurrence" button that was clicked in a context menu (see above), and is called from the `core_interaction_handling.js` file.  Basically this function gets the appropriate information from the `data-` attributes from the context menu to get the field/group information, and then calls the appropriate functions inside of `core_record_handling.js` to remove the occurence from the XML, and then removes the information from the DOM as well.  If there is a previous occurrence of the field, this function will call the other appropriate functions in order to populate the form with the appropriate data from the previous occurrence, otherwise, it will just clear the field/group.

- `ApplicationInterface#moveOccurrence`
  - `moveOccurrence` takes a single parameter, `calling_field`, which is a jQuery object representing the "move occurrence" button that was clicked in a context menu (see above), and is called from the `core_interaction_handling.js` file.  Basically this function gets the appropriate information from the `data-` attributes from the context menu to get the field/group information, and then calls the appropriate functions inside of `core_record_handling.js` to move the occurence in the XML, and then updates the occurrence information in the DOM, keeping the moved occurrence as the "active" occurrence.  Minimal checks are done--basically it will ask the user to specify an occurrence to move the currently displayed occurrence, and if the provided position is valid (ie. greater than 0, less than or equal to the total number of occurrences), the move will be performed.

- `ApplicationInterface#getValidatedTable`
  - `getValidatedTable` takes a single parameter, `calling_field`, which is a jQuery object representing either the field input, or the button that was clicked (attached to a form field) for triggering a lightbox to load in a validated table record.  A validated table record could be a People or Organization record--something like that.  The full list of currently available databases is listed in `params.valtable_view_links`.  It will extract which database to pull from by getting the last half of a class attribute from the field's container, for example for a People record, it would be `load_people`.  It will then get the appropriate URL to launch from the `params` variable, and then launch a lightbox where the user can query the database.  Once the user has selected the record they'd like to use, this function will call the `remap` function in `core_record_handling.js` to extract the relevant data based on the validated table's `map` (see `record_databases/*.js` for `map` explanation) and input it into the current record.  Once the data has been loaded into the XML, and the lightbox has fully closed, the function will then populate the appropriate field/group.

- `ApplicationInterface#loadExternalLink`
  - `loadExternalLink` takes a single parameter, `calling_field` which is a jQuery object representing the "load external link" link that was clicked.  The point of this function is that because there is currently no processing to normalize media (mostly video/audio) files, and no checks are made of the type of media that's uploaded to a field, all video/audio files are just downloaded to the client's machine rather than streamed.  This function also works on external URLs as well.  Basically, it's going to get the value of the adjacent form field, and launch that URL.  It *may* play right in the browser, but that's browser dependent--it will more than likely just download the file.

- `ApplicationInterface#loadValidatedTableRecord`
  - `loadValidatedTableRecord` takes a single parameter, `calling_field` which is a jQuery object representing the "load record" link that was clicked.  This function is used to launch a lightbox that will display the system default report for a record, or launch the link to the field if it is something like a video file, or external URL.  Most databases use a field with `ID` in the name which is used as the key to find the appropriate record with the exception of Locations, which only ever brings in the Location Code (which is a key in itself).  The function then launches a `COMMANDSEARCH`, which basically just returns that single record.

- `ApplicationInterface#loadValidatedTableField`
  - `loadValidatedTableField` differs from `getValidatedTable` in that while `getValidatedTable` loads a query form, and the user will select a record based on a search, `loadValidatedTableField` is used for cases where a proper query form is unnecessary--like the `VAL_USER` database.  It'll load in a single field, rather than using a map.  It takes a single parameter, `calling_field`, which is a jQuery object representing either the form field, or the adjacent button to launch a browse lightbox.

- `ApplicationInterface#uploadFile`
  - `uploadFile` works in conjunction with `upload.php` to upload files to the server.  You should also view the `upload.php` documentation (below) for setup of that file.  First this function is going to get a record's accession number, which is sent along with other data to `upload.php` in order to generate unique file names.  If no accession number is present in the record, the accession number '0000.000' is used instead.  Once the user goes through the process of uploading a file, then a function `handleFileUpload`, which is contained within `uploadFile` is called, which will change the appropriate field.  If the field is within the primary image group, the record's default image will also be updated (if it's the first occurrence of that group).

- `ApplicationInterface#downloadFile`
  - `downloadFile` takes a single parameter, `calling_field`, which is a jQuery object representing the "download file" link that was clicked.  This function is used to replace the `[M3IMAGE]` virtual path with a proper relative HTTP URL scheme.  Some early records that Christopher had entered used a Windows file path for some reason, and those cases are handled in this function as well.  Once the URL is properly rewritten, the browser will open the link to download the file.

- `ApplicationInterface#loadNewFormPage`
  - `loadNewFormPage` is used to perform an AJAX load on a new data entry form.  If you're going from the Acquisitions worksheet in a Collections database to the Media worksheet, this function is called.  It takes a single parameter, `calling_field`, which is the link that a user will have clicked.  Once the form has been loaded into the DOM, `populateForm` is called in order to populate the worksheet.

- `ApplicationInterface#handleActiveRestrictions`
  - `handleActiveRestrictions` doesn't take any parameters, and basically just checks to see if the current record has any active restrictions, and if it does, it adds a class to the restrictions icon to turn it red.

- `ApplicationInterface#loadTooltips`
  - `loadTooltips` is reliant on the "Tooltipster" plugin in the `/assets/js/vendor` folder.  First, the function destroys any existing tooltips on a form.  This is done so that when a user moves from one worksheet to another, and then back to the original worksheet, multiple tooltips aren't assigned.  This function is called as part of the `populateForm` function, so it's called whenever a new worksheet is loaded.  All of the tooltips to be loaded are stored in `/assets/js/dataentry/tooltips.js`, and documentation about their format is referenced in that section of this document.  The `tooltipster` function is called on every element which matches the `params.tooltip_elements` selectors.  

- `ApplicationInterface#setDefaultAddress`
  - `setDefaultAddress` is triggered in the Organization and People databases when a user clicks the "Set as Default Button".  This event passes the `calling_field` parameter to this function, which then calls the `setDefaultAddress` function in `core_record_handling.js`, and if successful, displays an alert message to the user telling them the default address has been set.

- `ApplicationInterface#saveRecord`
  - `saveRecord` is called from the `core_interaction_handling.js` file, and is passed two parameters, the `form_action`, which is the URL the form is to be POSTed to, as well as `form`, which is a jQuery object representing the form to be submitted.  Before the form is *actually* submitted, it's prepared for submission by `core_record_handling.js`, which is documented further in this document as well, but the jist is that it takes all of the XML data related to the record and puts it into a format that MINISIS understands.

- `ApplicationInterface#updateImages`
  - `updateImages` was put in after initial development, and is used when a group contains an image.  When a user uploads an image, this function is called and replaces the placeholder image with the image that has just been updated.  If an image isn't present, a placeholder image is inserted in its place.

- `ApplicationInterface#setCurrentLocation`
  - `setCurrentLocation` is fired when a user changes a record's current location.  The purpose of this function is to keep the `C_CUR_CODE` field updated with the value of `CURATORS_CODE`, which is a Collections record's definitive "current location".

- `ApplicationInterface#cancelMove`
  - `cancelMove` is fired when a user clicks the "Cancel Move" button on the Movement worksheet in the Collections database.  It takes a single parameter, `calling_field`, which is a jQuery object representing the "Cancel Move" button the user has clicked.  If the occurrence of the planned move already has a `moved_flag`, the function just changes the `moved_flag` to a value of `Cancelled`, otherwise it will add the `moved_flag` element to the group occurrence with a value of `Cancelled`.

- `ApplicationInterface#performMove`
  - `performMove` is fired when a user clicks the "Perform Move" button on the Movement worksheet in the Collections database.  Like `cancelMove`, it takes a single parameter, `calling_field`, which is a jQuery object representing the "Perform Move" button the user has clicked.  This function utilizes the `remap` function inside of `core_record_handling.js` to bring data from the "Planned Move" group into the "Current Location" group.  The original application specs I was given had asked for the most current location to be the first occurrence of the "Current Location" group, and so when the move is performed, it's first brought in as the last occurrence, and then moved into the first occurrence's spot.  It was for this reason that the `setCurrentLocation` function was necessary, since in actuality, MINISIS tries to autopopulate the `C_CUR_CODE` field with the *last* occurrence of this group, and so it's necessary to explicitly set it.  




---------------------------------




### File `assets/js/dataentry/core_interaction_handling.js`:
This file handles all of the user interaction between your HTML files, and a record.  This file is *strictly* for event handling, and little to no logic should be included within this file.

It handles:
  - **handling click events for requesting new group and field occurrences**
  - **handling data change events for manipulating the HTML into the XML record**

It is passed *one required*, and *one optional* parameter.  The required parameter, `app_interface`, is an instance of `ApplicationInterface` from the `interface_handling.js` file.  The optional `params` parameter, is a javascript object which contains keys and values related to the views associated with the application.

#### `params` Parameters:
  - `form_container` : Should *always* be `app_interface.interface_params.form_container`
  - `prev_group_occurrence` : The desired toggle element selector for getting the previous occurrence of a group
  - `next_group_occurrence` : The desired toggle element selector for getting the next occurrence of a group
  - `prev_field_occurrence` : The desired toggle element selector for getting the previous occurrence of a field
  - `next_field_occurrence` : The desired toggle element selector for getting the next occurrence of a field
  - `repeating_context_toggle` : The desired toggle element(s) selector(s) for triggering the 'Remove' and 'Move' Occurrence context menu.  This shouldn't need to be changed.
  - `move_occurrence_toggle` : The desired toggle element selector for triggering the Move Occurrence functionality.  This shouldn't need to be changed.
  - `remove_occurrence_toggle` : The desired toggle element selector for triggering the Remove Occurrence functionality.  This shouldn't need to be changed.
  - `cancel_planned_move_toggle` : Element selector for cancelling a planned move button
  - `perform_planned_move_toggle` : Element selector for performing a planned move button
  - `move_occurrence_toggle` : Element selector for moving an occurrence (group and field)
  - `remove_occurrence_toggle` : Element selector for removing an occurrence (group and field)
  - `get_valtable_toggle` : Element selector for loading a validated table record in (eg: the "Load Organization Record" button for Acquisition Source)
  - `view_valtable_toggle` : Element selector for viewing a validated table record's system default report
  - `save_valtable_toggle` : Element selector for saving a validated table record (in dynamic record adding worksheets like people/org)
  - `cancel_valtable_toggle` : Element selector for cancelling adding/editing a validated record in dynamic add mode
  - `save_valtable_form` : Element selector for the form which is used to dynamically add validated table records
  - `validated_field_toggle` : Element selector for validated table (browse fields) records, toggling the browse view
  - `new_form_toggle` : 
  - `save_record` : Element selector for toggling a record to be saved
  - `file_upload` : Element selector for toggling a lightbox for uploading files
  - `file_download` : Element selector for toggling a file download 
  - `img_group` : Element selector(s) for a group of images (like Image Reference Group in Collections)
  - `nomenclature_toggle` : Element selector for toggling Chenhall selection
  - `component_toggle` : Element selector for a specific occurrence of Components (in Collections only)
  - `component_add_toggle` : Element selector for toggling a lightbox to add a component
  - `component_edit_toggle` : Element selector for toggling a lightbox to edit a component
  - `component_remove_toggle` : Element selector for toggling removal of a component
  - `component_save_toggle` : Element selector for saving a component record in a lightbox
  - `component_save_form` : Element selector for the form which will save a component record.
  - `costs_select_toggle` : Element selector for a specific occurrence of a Loan Cost (in Loan Out only)
  - `costs_save_toggle` : Element selector for saving a loan cost record in a lightbox
  - `costs_add_toggle` : Element selector for toggling a lightbox to add a Loan Cost
  - `costs_edit_toggle` : Element selector for toggling a lightbox to edit a Loan Cost
  - `costs_remove_toggle` : Element selector for toggling a lightbox to remove a Loan Cost
  - `costs_calculate_toggle` : Element selector for the "Calculate Total Cost" button in Loan Costs
  - `set_default_address` : Element selector for "Set Default Address" button (in People and Organization databases)
  - `mnemonics_to_ignore` : Any mnemonics which shouldn't be submitted with a form submit

#### Functions:
The functions contained in `core_interaction_handling` are all jQuery events.  For debugging purposes, first track down the issue as an event--for example "I'm having troubles with fields not updating in the XML when I change them on the form", well, first check the event, which would be `$(interaction.params.form_container).on('change', ':input', function() { // some code });`, which has a call to `app_interface.updateField($(this));`.  So, in this case, then you will know to then check the `ApplicationInterface#updateField` function for further debugging.  

The reason that `$(this)` or a `$(this)` derivative is passed along to many functions is it gives the lower level functions a context for its processing without giving it access to the entire visible DOM, which isn't necessary.    



-------------------------------------




### File `assets/js/tests/*.html` and `assets/js/tests/*.js`:
The files inside of the `tests` folder are used automatically test all of the functionality of the application based on sample data loaded into the appropriate `*tests.html` file.  How they work, is the HTML file loads in a predefined (and hardcoded) sample record, followed by all of the required javascript files for the aspect of the application to be tested.  Afterward, another javascript file, matching the HTML filename is loaded which will initialize the application, and run the tests.

Testing will be described in its own section, so if you're looking for *how* to test, be sure to check out the Testing section.



-------------------------------------



### File `assets/js/helpers.js`:
This file includes functions which are used by various parts of the application.  They are used to provide functionality that is not native to the javascript language which can help to facilitate smooth operation of the application itself.  



-------------------------------------



### File `assets/js/frontend.js`:
This file handles dealing with the front end of the site.  It's used to handle dealing with searches, dealing with some of the global aspects of the front end of the site like getting user names, that type of thing.  This is the file to look at if you're looking at getting a bit deeper with the search aspects of the site.

#### `assets/js/frontend.js` Functions:
  - `getUsername`:
    - This function doesn't take any parameters, and utilizes the jQuery Cookie plugin to easily get and return the `USERNAME` cookie set by MINISIS when a user logs in to determine which user is logged in.

  - `setActiveDatabase`:
    - This function doesn't take any parameters, but will search the DOM for the currently active database and will add the `active` class to the navigation bar which will be styled via CSS.

  - `hideSearch`:
    - This function is passed a single parameter (`caller`) which is a jQuery object representing the object which fired the event--the form to be hidden, generally.  Basically it will change the icon from an eye to an eye with a slash through it, and then use jQuery's `slideToggle` function to roll up or roll out the current form.

  - `toggleLineMode`:
    - This function doesn't take any parameters, and is used to visually hide/show (hence "toggle") between keyword searching and line mode using CSS class manipulation and the `slideToggle` function from jQuery.

  - `toggleSimpleAdvancedSearch`:
    - Like `toggleLineMode`, `toggleSimpleAdvancedSearch` uses CSS class manipulation and the jQuery `slideToggle` function to show/hide the advanced search fields on a query worksheet.

  - `setupSearchCall`:
    - This function is used to prepare the DOM and set up the query statement to send to MINISIS based on the filled out fields on a query worksheet.  It replaces the form with a "loading" form, serializes the form, generates a state based on the currently displayed form data, and then calls either the `performGlobalChangeSearch`, or the `performSearch` function, depending on the type of search to be performed.

  - `performSearch`:
    - This function takes two parameters, the form `action`, and the `form_data`.  `action` is a string URL for where the form is to be POSTed to, and `form_data` is a serialized copy of the form data.  This is sent via AJAX by the jQuery `post` function, and when the search has completed and a response is returned, `handleSearchResults` is called to deal with taking the form response and putting it into the DOM.

  - `performGlobalChangeSearch`:
    - This function takes the same parameters as `performSearch`, and works in a similar way to `performSearch`, however in a global change query, all that's getting returned in the initial query is another URL that's generated by MINISIS, so first the function's going to check that the response was less than 200 characters (which is a character count based on a "correct" response of a URL, any more would likely be an error message), and if so it uses the jQuery `get` function to dynamically load in those results into the DOM.  If there was more than 200 characters returned by the POST, there was likely no results, or an error returned and so an appropriate message is displayed in the DOM instead.

  - `submitGlobalChange`:
    - This function takes a single parameter which contains the `caller` of the function--which is going to be the "submit global change" button.  When the user clicks that, another form is POSTed to MINISIS with the appropriate global change information via the jQuery `post` function.  When the response is received from MINISIS, `populateGlobalChangeResults` is called to put the returned response into the DOM based on the `data` that was returned.

  - `populateGlobalChangeResults`:
    - `populateGlobalChangeResults` is passed the HTML parsed `data` that is returned from `submitGlobalChange`.  It's going to first replace the table data with the appropriate results, but it also attaches some event handlers to the data that's passed as well, so that when a user clicks on one of the links to get information about the submitted global change that those links are followed via AJAX rather than as a traditional link.  

  - `handleSearchResults`:
    - There are many functions contained within the broad `handleSearchResults` function, all of which are described below.  What the actual `handleSearchResults` function does is it takes a single parameter, `data`, which is the full payload from a MINISIS search.  It's going to divide up that payload into its appropriate sections and deal with it using the functions listed below in order to fully populate the DOM.

    - `populateSearchMetadata`:
      - `populateSearchMetadata` is passed a JSON object with the following properties: `query` is a String containing the user's search statement, `total_results` is a number based on the total amount of results returned by the search, `first_result` is the position of the first result on the page in the context of the full search (for pagination, so if you had ten results per page, on the second page, `first_result` would be `11`), and `last_result`, which is the position of the last result on the page in the context of the full search (again, like `first_result`, on the first page of a search with 10 results per page, `last_result` would be `10`).  The function then generates a bit of HTML to give the user some context about their search, or will return some HTML letting the user know that no results were found if no results were returned for a given query.

    - `populateSearchResults`:
      - This function is passed three parameters--`data`, which is a jQuery object containing a table with the search results (if pagination applies, it will only return the current page of results), `database`, which is a String representing the currently accessed database, and `multi_form_action`, which is a URL for POSTing selected records back to MINISIS for use with `^SAVE_AND_NEXT^` functionality.  The bulk of the function is contained within a `switch` statement, which is toggled depending on the database.  Each of the cases in the switch statement are going to generate the appropriate table header for a results table based on the amount of columns that will be in the results table.  If you're going to be displaying 4 fields in the results table (for example `SISN`, `Accession Number`, `Object Type`, and `Object Name`), you'd append a `<thead>` element with those fields as `<th>` elements, and then as a fallback if no results were returned, you'd pass the value `4` to the `generateNoResultsBody`, which just returns a `<tbody>` element with a single column that will span the amount of columns in the table to tell a user there were no results.  Once the HTML has been generated, the `.results_container` is populated with the generated HTML.

    - `handleSearchStatement`:
      - When a user performs a simple search the query statement that MINISIS returns will say `KEYWORD_CLUSTER 'query statement'`.  Rather than say `"You searched for KEYWORD_CLUSTER 'query statement'"`, it looks a bit nicer to just say `"You searched for 'query statement'"`, so this function removes `'KEYWORD_CLUSTER'` from the displayed search statement.

    - `handleSearchNumbers`:
      - This could've been handled differently knowing what I know now, but when I made this, I was getting the first and last record numbers for a page from a single user routine in MINISIS, so this function takes the "displaying records 10 to 20" statement and puts the `10` and `20` values into an array for use with populating the search results.

    - `handleMultiFormAction`:
      - MINISIS returns the multi form action wrapped in double-quotes (""), but what we're looking for is the raw URL, so this function returns that raw URL.

    - `handlePagination`:
      - MINISIS has a weird issue where if a range of records is returned (say you did a `++@` or `SISN 1/20` search), and any record is missing from that range, like if you said "Give me the records from SISN 1 to SISN 20", and SISN 2 had been deleted, rather than just output a page with SISNs 1, 3, 4, 5, 6, 7, 8, 9, 10, and 11, instead the first page will be SISNs 1, 3, 4, 5, 6, 7, 8, 9, and 10, but then output two sets of pagination links.  For every missing SISN, another set of pagination links is generated--it doesn't make any sense, and I e-mailed Richard multiple times about it, but the guy's got a million and one things on his plate, so rather than wait and wait for him to have time to fix it, this function was written as a workaround.  Basically it's going to check to see if multiple pagination links are returned with the results response, and if there are, it'll remove all but the first one.  It's fine that it only returns the first one as every pagination set is identical, just duplicated.  I don't understand why it happens from MINISIS either, I just know that this function "fixes" it for the user.  Oh, also, so when this happens, if you have a range of records, SISN 1-20, and there's 6 SISNs missing between 1 and 10, there'll only be 4 records on that first page.  Also makes no sense...

  - `handleCopyToRecord`:
    - If a search is done while in the data entry section of the site on a validated table, there'll be a button to copy the data from the validated table record to the parent record.  This function finds the XML copy of that query result record, and sends it to the `parent` (which is the window behind the lightbox) and then closes the lightbox.

  - `initiateDynamicTriggers`:
    - Initializes some event handlers for data that will be dynamically loaded from AJAX page loads

  - `getDetailedRecordDisplay`:
    - `getDetailedRecordDisplay` handles the page load of a record's detailed report via AJAX.  It's passed a `url` and (optionally) the `e`vent that triggered the function to load.  The reason that `e` is an optional parameter is that it's possible for someone to visit the URL without following a link (if they open the "View Record" link in a new tab, it will not be handled in the same way, and `e` will not be passed).  Basically, if someone is following the link "normally", the function will only load the appropriate XML in order to populate the DOM, and a page state is generated (to handle users clicking the "back" button), but if someone visits the page via the URL, or opens it in a new window (and not a link), a page state is not generated, and the full page is loaded.

  - `handleCheckboxes`:
    - Because every browser's implementations of a checkbox is different, this function takes the browser's native checkboxes and replaces them with icons that look like checkboxes, and then attaches an event handler to them so that they still behave like checkboxes.  This way the checkboxes are a little nicer, but more importantly are consistent across every browser.

  - `getPaginatedSearchResults`:
    - `getPaginatedSearchResults` works in the same way as `getDetailedRecordDisplay` in that there are two ways to handle the request, either via clicking a link and following it normally (which loads the content via AJAX and generates a state), or the user can open the link in a new window, which is *not* going to generate the state.  Once the data is loaded back from MINISIS, `handleSearchResults` is called to populate the DOM appropriately.

  - `queryFormBooleanOperators`:
    - This function is passed two parameters, the `e`vent which caused the function to be called and `caller` of the event, which is a jQuery object representing which of the Boolean operators that was clicked.  This function handles when a user clicks on the query form boolean operator buttons (AND/OR/NOT) on a query form.

  - `enterFormSubmit`:
    - This function handles when a user clicks enter on a query form, to submit the form.  I put this in because I was sick of moving my hands from the keyboard to the mouse to click that stupid little button--but it actually works pretty well and I'm pretty sure it is expected behaviour for a form at this point.  You should leave it in.  

  - `multipleRecordSelection`:
    - 

  - `getNextRecord`:
    - When a user clicks on multiple records in a summary report and loads them all at once, MINISIS sends all of those records back as a single result.  When I was doing the "save and next" functionality (or what I *thought* was the "save and next" functionality), there was no way to do a "save and next" when all of the records were loaded as one.  What this function does is that is works in conjunction with the `handleDetailedRecordDisplay` function below, so that when multiple records are loaded in at once, only one record is displayed at a time.  This function replaces the currently displayed detailed record display with the next record to be viewed, if there is one.  Otherwise it will return `false`.

  - `generateDetailedReport`:
    - When I created the first M3 Online, I had to do an MWI report for each mnemonic in every single database.  It was an absolute nightmare, and took about 500 times longer than I felt like it needed to.  Rather than deal with that, and the two hundred billion conditionals that came along with doing those reports, instead I used MINISIS's `^RECORD_XML^` user routine and instead just returned a record's XML.  This function goes through the XML node by node and if it finds a node which contains a text value (aka. a field), it will first output the node's mnemonic as a `<dt>` element, and then the value of that node as a `<dd>` element.  I styled it via CSS to look like the system default report as per the older version of M3 Online, but because it's now semantic HTML and not a `<pre>` element, if someone wanted they could style this however they wanted.

  - `handleDetailedRecordDisplay`:
    - This works alongside the above `generateDetailedReport` function.  It's going to ensure that record XML has been returned, but also, in the detailed reports (for example `WEB_COL_DET_REP` for Collections), before the `<record>` part of the XML, I added values for the links, like "Edit Record", "Copy Record", "Delete Record", etc.  This function parses the values from those XML nodes and updates the links in the DOM so that the user can actually *do* stuff with the record.

  - `generateState`:
    - This function generates a page state, so that when a user follows a bunch of links and does a bunch of stuff throughout the site that has been loaded in via AJAX that the user isn't completely kicked out of the site when they hit the "back" button, it helps to make the browser behave the way you would expect it to.  In all honesty, my knowledge of this when I wrote it was pretty green, so this could probably use a better set of eyes and hands than my own in the future to improve on its functionality.  It "works", but it's not great.

  - `populateState`:
    - This function works alongside the `generateState` function above.  When a user clicks "back" or something like that, this is going to populate the DOM with the appropriate state.  If the previous state was a query result, the appropriate `getPaginatedSearchResults` function is fired.  If the previous state was a detailed record display, then `getDetailedRecordDisplay` is fired, etc.

  - `handleRecordDeletion`:
    - Basically this function is fired when a user clicks "delete record" on a detailed record display page.  If the user confirms that they would like to delete the record, the record is deleted and the user is directed back to the query worksheet.

  - `handleReports`:
    - If you're looking to add a report to a summary report, you need to add the MINISIS report name into `search/<database name>.html`, at the bottom in the "Reports" part of the page.  What *this* function does is loads up a lightbox with the values of the reports you've added to those HTML pages and allows the user to download them from there.

  - `browseColorbox`:
    - This function is called when a user clicks on the "Browse" buttons on a query worksheet.  It takes the mnemonic of the adjacent field and uses it as the title for the Browse worksheet, and when the value is double clicked on, the browse page will send that value (`tmp_val`) back to the caller (this function), which then sets the appropriate value of the field to the value that the user just clicked on.


-------------------------------------


### File `assets/js/dataentry/frontend.js`:
This file handles dealing with the front end of the data entry side of the site.  It's used to make editing the HTML files easier, as a lot of the markup that's necessary to make the HTML forms work properly (like handling occurrences of repeating fields/groups) is superfluous to the actual application, so handling it all in one place keeps the code clean.

As such, it includes a number of functions which work with certain HTML classes and elements, which are detailed below:

#### `assets/js/dataentry/frontend.js` Functions:
  - `addImagePlaceholder`:
    - If a fieldset contains an image (`.contains_image`), this function adds a placeholder image before the field is populated by an actual image.

  - `generateRecordSavingForm`:
    - Rather than have the superfluous "saving" form inside of an HTML file, it's placed into a page via javascript to keep things clean.  This will be explained in more detail in the "Record Saving" section.

  - `updateDatabaseActionLinks`:
    - Because many of the page loads happen via AJAX, the database actions (save, cancel, back to search, reports, etc) have their `href` location set to `#` by default.  Rather than deal with having a huge amount of files to handle every interaction and case in the HTML, instead reports in the SMA which will make use of these links will have a "`site_params`" object which should contain the appropriate `href` path to change the action links to.

  - `cleanDatabaseActionLink`:
    - Some of the data entry files will contain references to action links but may not be interpreted by MINISIS.  In these cases, the `site_params` variable will be properly set, but will contain references to the MINISIS carat operator rather than the actual link (for example `^SAVE_AND_NEXT^` rather than `http://somesite.com/mwimain.dll/11/some_url`).  If the carat operator is encountered in a URL, this function will replace that URL with a `#`, and disabled the button, because the URL will not work anyway.

  - `setupRepeatingGroup`:
    - This function handles the basic markup for handling repeating groups.  Basically, if you have an HTML element `<fieldset class="repeating_group">`, this function will append all of the necessary handlers that allow a user to navigate a repeating group.  This helps to keep the HTML forms clean and free of MINISIS markup, so that they can be easily edited and added to by just about anyone without having to worry about all of the application markup in addition to the database markup.  Also, by handling this in this way, if someone wants to change how a repeating group is handled from a markup perspective, they only need to change this one file, rather than every in every HTML data entry form for the application.

  - `setupRepeatingField`:
    - This is a continuation of `setupRepeatingGroup`, only for repeating fields instead of repeating groups.

  - `setupValidatedTableField`:
    - Some fields in MINISIS are setup as a pick list using the `^INDEX_LIST^` functionality in MWI.  These fields are set up like `<div class="validated_field field_container">`, and need to contain a `<label>` element, as well as an `<input>` element.  This function will append a "browse" icon (the three bars), which users can click on to launch that index list and pick a value from.

  - `setupBrowseField`:
    - This function deals with setting up validated table elements with the appropriate links to allow for data to be loaded in from different databases.  Basically, if the validated table is coming in from the Organizations database, then this function will ensure that the "Load Organization" icon is added, as well as that an icon to view the system default report for the record that is loaded into that field is present.  This function handles setting up the fields for:
 
     - People Records
     - Organization Records
     - Locations Records
     - Event Records
     - Collections (M3) Records
     - Restrictions Records
     - File Upload Fields
     - Image Upload Fields
     - Video Upload Fields
     - Audio Upload Fields
     - Text Upload Fields
     - URL Fields

  - `setupSelectBoxes`:
    - Every browser has a different implementation of the `<select>` element, and styling them is honestly a gigantic pain in the ass.  What this function does is allow someone to enter in a standard `<select>` element into a data entry form, and this will add a wrapping `<div>` element, as well as an icon at the end so that across the browsers, every `<select>` element looks and behaves exactly the same.  There are other JavaScript solutions available for doing this, but most of those are pretty bloated, so this works quite well while having minimal footprint.

  - `setupCheckBoxes`:
    - Like `<select>`, `<input type="checkbox">` elements are a pain in the ass to style uniformly across all browsers.  As such, what this little function does is replace the checkbox with an `<input type="hidden">` element.  Additionally, it will also wrap the element in a `<span class="check">` element, which replaces the standard checkbox with an icon representing an open checkbox.  Population of these check boxes is handled in the next function...

  - `populateCheckBoxes`:
    - Basically, because checkboxes have been replaced with icons *representing* a checkbox, this function handles the display of whether the checkbox has been checked or not.  It does this by checking the value of the `hidden` form element--if that element has a value, then the checkbox is "checked", otherwise, it hasn't been checked.

  - `handleCheckBoxes`:
    - This function works hand in hand with the `populateCheckBoxes` function above.  This function handles setting the "checked" value of the hidden form field, as well as triggering a `change` event, which will be handled by the `core_interaction_handling.js` file.

  - `setupDatePicker`:
    - This function adds the markup necessary to ensure that a datepicker will be attached to fields requiring one.  Basically, if you have a field container with the class `date`, this function will add the date picker to the appropriate field within that container.  The only parameters within this function which may require editing are the `dateFormat` parameter, which allows the user to specify the format of the selected date (go figure!), as well as `yearRange`, which allows the user to select acceptable date ranges in the format of `start_year:end_year`, for example: `1600:2025`, which is the default.

  - `hideGroup`:
    - This function is called when a user clicks the "Hide Group" icon, which is triggered in `core_interaction_handling.js`.  It slides the entirety of a group `<fieldset>` into itself, effective hiding or revealing itself with a click.  It also changes the icon from an eye, to an eye with a slash through it depending on whether the group is visible or not.

  - `selectActiveTab`:
    - This handles showing that a given tab is "active" in the data entry forms.  Every data entry form's HTML page should have a hidden `<span>` tag which contains information about that particular page.  This function finds that element, extracts the relevant data, and handles displaying the appropriate markup and style.  This is documented in more detail in the documentation about the data entry form HTML.

  - `loadForm`:
    - Basically this function will replace the currently loaded data entry form with a spinning progress wheel, and then load in the next data form via AJAX, and then replace the progress wheel with the loaded page.  Once the form has been successfully loaded, it calls the initialization script which sets up all of the event handlers for a given page.




-------------------------------------




### File `assets/js/tooltips.js`:
This file consists of a single globally scoped JavaScript object, `tooltips`, which contains key/value pairs for every mnemonic which requires a tooltip.  Tooltips are in the following format: `'FIELD_MNEMONIC': 'Tooltip text'`, where `FIELD_MNEMONIC` is a JavaScript-variable-valid String value, and `Tooltip text` is a plain-text string representing the text to display for a given field.  While the values of each tooltip is set in this file, the actual behaviour is handled by the Tooltipster jQuery plugin, as well as a `hover` event in the `core_interaction_handling.js` file.



-------------------------------------




### File `assets/js/vendor/*.js`:
The `vendor` folder contains all of the required third-party javascript files such as [jQuery](http://jquery.com), [jQueryUI](http://jqueryui.com), [Colorbox](http://www.jacklmoore.com/colorbox/), and [tooltipster](http://iamceege.github.io/tooltipster/).  Functionality from these files is likely necessary for the smooth operation of the application, and these files should not be modified unless you *really* know what you're doing.




-------------------------------------




### File `assets/css/*.less` and `assets/css/*.css`:
If you're unfamiliar with `*.less` files, they are *like* standard CSS files, and are compiled *into* standard CSS files, but allow for a *ton* of extra functionality, and can really help to organize and clean up a site's primary stylesheets.  If you'd like more information on `*.less` files, check out the docs at the [LESS.js](http://lesscss.org/) site.  With that being said, if you see a `*.less` file, *don't* just edit the corresponding `*.css` file!  This is going to create a disconnect between the source stylesheet, and the *actual* stylesheet, which will make maintainability of the site a nightmare.  Just don't do it.  Ever.  If there is *only* a `*.css` file, and you *know what you're doing*, by all means edit it, but document and sign your changes, so we have someone to blame.  `*.css` files will likely be vendor styles, and should not under any normal circumstances need to be overwritten.  If you *need* to override a vendor stylesheet, do it in one of the application `*.less` files.  Keep things as tidy as possible.



-------------------------------------



### File `assets/img/*.*`:
All site-wide images will be stored in this folder.  If you're using an image in the HTML and it's not a part of a specific record, this is the folder to put that image into.



-------------------------------------



### File `assets/html/template/*.html`:
All HTML relating to the skeleton of the site should be placed into this folder.  "Skeleton of the site" refers to any file which is going to surround your forms.  Headers, footers, doctypes, sidebars (if used), etc, should be placed in here.



-------------------------------------



### File `assets/html/data_entry/*`:
Any files relating to data entry forms should be placed in a folder matching the appropriate database name and placed inside of this folder.  



-------------------------------------



### File `assets/html/search_forms/*`:
Any HTML files which handle a database search form should be placed inside of this folder.  



-------------------------------------



### File `/*.html`:
HTML files in the root of the application will likely be container files for query forms, global change forms, or data entry forms.



-------------------------------------



### File `/upload.php`
Used for uploading files to the server



-------------------------------------






# Part Three: The HTML Templates

HTML templates for the data entry forms need to follow a relatively simple, but rigid syntax in order to work correctly.  I'll start out with the Collections database since that's where the majority of data entry happens.  

The "core" data entry file for a database is located in `/dataentry/<database name>.html`.  The `body` element will have a `data-database` attribute equal to the database name which is used for setting the active tabs in `dataentry/frontend.js`.  

Collections has a `universal_record_information` section, which is the section at the top for record data which is not worksheet specific--stuff like the accession number, current location, that type of thing.  It also contains the `img_container`, which initially will hold a placeholder image for the record, but this will be populated by a record image, thanks to some processing within `core_interface_handling.js`.

The majority of the "meat" of these data entry forms is contained within the `div#primary_data_entry_form` element.  First, there is the `primary_worksheet_nav`, which is the top-level worksheet selection links.  These links all have a `data-form` attribute which is used by `core_interface_handling.js` to set the active tab styling, as well as to determine which `secondary_worksheet_nav` is to be displayed.  

`nav#secondary_worksheet_nav` contains a series of `ul` elements, the `id` attributes of which correspond to `data-form` attributes from `primary_worksheet_nav`.  If you're on the `acquisition` "main" tab, the `ul#acquisition` will be visible.  Similarly, if you are on the `catalogue` "main" tab, the `ul#catalog` will be visible.  Each of the list items within the `ul` elements inside of `nav#secondary_worksheet_nav` will *also* have a `data-form` attribute which is used by `core_interface_handling.js` to set the active tab.  

`div#data_entry_form` contains the actual data entry form, each of which are located within `/assets/html/dataentry/<database>/<worksheet>.html`.  This is where the majority of the "magic" (if you want to call it that) happens.

Below the footer, which at the time of writing is not populated with anything, is a hidden `xml` element.  This contains a single string of text, `^XML_TREE^` which is used by MWI, and replaced with an XML copy of the currently loaded record which the application relies heavily upon.  As a side note, if you ever see `^SOMETHING^` in the browser, something with MINISIS isn't working right--these should *always* get replaced by MWI.

After the record XML, there's another `div`, `#notices`, which contains a string `^WIN_INFO^` which will be replaced by MWI if there are any errors or notices when a record is saved.

Next are all of the required scripts.  If you haven't encounted the `<!-- include virtual="/some_url.html" -->` syntax before, it's used by IIS, and sort of akin to `<?php include 'some_url.php'; ?>`.  

OK, now onto that "required syntax" that I was talking about, because now I'm about to talk about the *actual* data entry worksheets, like the ones located in `/assets/html/dataentry/collections`.  

The first line of one of these data entry worksheets contains a hidden `<span>` tag.  This `<span>` tag is used by some of the JavaScript in order to set the appropriate active tab.  The syntax for this line is `<span class="hidden current_page" id="PRIMARY_SECONDARY">` where `PRIMARY` is the value of the `data-form` attribute in the `primary_worksheet_nav`, and `SECONDARY` is the value of the `data_form` attribute in the `secondary_worksheet_nav`.

A form row is set up using a `div` element with a class of `form_row`, like `<div class="form_row"><!-- some elements --></div>`.  The most basic thing to put inside of a form row is a `field_container`, which contains a single form input/select element.  If the `form_row` you're adding is the *last* row in a group, or on a worksheet, you should prefix the `form_row` class with `borderless` for styling purposes, like `<div class="borderless form_row"><!-- fields --></div>`.

Each `field_container` also needs to contain a size.  Those are the only two required classes for a `field_container`.  An example of a full-sized (100% width) form field would be:

    <div class="form_row">
        <div class="full field_container">
            <label for="MNEMONIC">Some Mnemonic</label>
            <input type="text" id="MNEMONIC">
        </div>
    </div>

The valid sizes for a `field_container` are `full`, which is 100% width, `large`, which is 75% width, `medium` which is 50% width, and `small` which is 25% width.  The widths of all of the `field_container`s within a `form_row` **must** equal 100%.  Technically, you could have *less* than 100%, but it looks ugly.  If you have more than 100% width, it will look broken, and you should feel bad about it.

**Valid combinations of field sizes for a form row are:**

  - 1 `full` = 100% width used
  - 1 `large`, 1 `small` = 100% width used
  - 2 `medium` = 100% width used
  - 1 `medium`, 2 `small` = 100% width used
  - 4 `small` = 100% width used

So, for a `form_row` containing two elements, the syntax would be:

    <div class="form_row">
        <div class="medium field_container">
            <label for="MNEMONIC">Some Mnemonic</label>
            <input type="text" id="MNEMONIC">
        </div>

        <div class="medium field_container">
            <label for="ANOTHER_MNEMONIC">Another Mnemonic</label>
            <input type="text" id="ANOTHER_MNEMONIC">
        </div>
    </div>

In the case of something like a measurement, where a unit would be selected immediately after the value (like `12 feet`), you'll want to use the `combo` class with your `field_container` class.  This changes the width of the input box and allows you to put a `select` box beside it without messing up the style of the site.  You'd enter it using the following syntax:

    <div class="form_row">
        <div class="full combo field_container">
            <label for="WIDTH_IMP">Width</label>
            <input type="text" id="WIDTH_IMP">
            <select id="WIDTH_UNIT">
                <option value=""></option>
                <option value="inch">in</option>
                <option value="feet">ft</option>
                <option value="mm">mm</option>
                <option value="cm">cm</option>
            </select>
        </div>
    </div>

There is more to a MINISIS worksheet than just elementary text fields though, so let's move on to **repeating fields**.

A repeating field is laid out in the HTML just like an elementary field, with *one* difference, which is the addition of the `repeating_field` class to the `field_container`.  That's all you need to do.  The rest of the processing is handled by `dataentry/frontend.js` to add all of the arrows and occurrence information.  So, if the first field in the previous example was a repeating field, the syntax would be:

    <div class="form_row">
        <div class="medium repeating_field field_container">
            <label for="MNEMONIC">Some Mnemonic</label>
            <input type="text" id="MNEMONIC">
        </div>

        <div class="medium field_container">
            <label for="ANOTHER_MNEMONIC">Another Mnemonic</label>
            <input type="text" id="ANOTHER_MNEMONIC">
        </div>
    </div> 

That's it.  You've just created a repeating field.

Another type of field modifier you can use is the `date` modifier, which signifies that a `field_container` contains a date field.  These date fields will be modified by `dataentry/frontend.js` to include a trigger, which will allow for a "date picker" interface to be visible so that a user can just click on a date and have it populate the field with the correct format.  If the second field in the previous example was a date field, the syntax would be:

    <div class="form_row">
        <div class="medium repeating_field field_container">
            <label for="MNEMONIC">Some Mnemonic</label>
            <input type="text" id="MNEMONIC">
        </div>

        <div class="medium date field_container">
            <label for="ANOTHER_MNEMONIC">Another Mnemonic</label>
            <input type="text" id="ANOTHER_MNEMONIC">
        </div>
    </div> 

If you've taken a look at the existing M2A Online application, you'll have encountered "Validated Tables", which basically give the application the ability to load data from another database into the current record.  To add a validated field to your worksheet, there are *three* attributes you need to add to your `field_container`, a class that's relevant to the validated table you're loading from, as well as a `data-map` attribute which specifies how to map the data that comes in from the other database into the current database.  Finally, you should add the `readonly` attribute to the input element, because you want the user to load the data in from the validated table, and not to type it (or edit it) themselves.

For every database but "Locations", you'll also want to put in another hidden form field for the unique ID which will be brought in.  The point of this is for when the user clicks on the "View Record" button for viewing the validated record, JavaScript will search for the closest ID field to query with.

**Valid classes for validated tables are:**

  - `org_validated_field` : Organizations Database
  - `people_validated_field` : People Database
  - `location_validated_field` : Locations Database
  - `event_validated_field` : Events Database
  - `m2a_validated_field` : Collections Database
  - `restrictions_validated_field` : Restrictions Database
  - `matthes_validated_field` : Matthes Database
  - `technique_validated_field` : Technique Database
  - `subject_validated_field` : Subject Database
  - `relationship_validated_field` : People Relationship Database
  - `orelationship_validated_field` : Organizations Relationship Database

So, in order to put that together into a field that loads in an organization record, the syntax would be:

    <div class="form_row">
        <div class="full org_validated_field field_container" data-map="some_map">
            <label for="MNEMONIC">Organization Name</label>
            <input type="text" id="MNEMONIC" readonly>
            <input type="hidden" id="MNEMONIC_ID">
        </div>
    </div> 

That's it!  `dataentry/frontend.js` will handle setting up the icons the user will click on.  For some fields, the data you want may come from multiple validated tables.  For example, the `Appraiser` field in the Insurance worksheet in the Collections database.  Technically, an Appraiser could be an organization, *or* an individual.  In cases like this, just add both classes to the `field_container` and take note of their order.  Then, in your `map`, keep that same order and handle both cases.  If you open up `assets/js/dataentry/record_databases/collections.js` and check out how the `revaluation_appraiser` map is handled, this is the correct way to handle these cases.

Another type of field that's pretty similar to validated table fields is the `file_attachment` field, which will allow you to upload files.  There are *two* required classes, and one attribute to be added to a file attachment field--`file_attachment`, as well as the type of file that's being attached.  Finally, like the validated table fields, you'll want to make the input `readonly` so the user can't edit the path themselves.  Specifying the type of field changes the icon the user clicks on.  Valid types are:

  - `image` : Images
  - `video` : Video
  - `audio` : Audio
  - `text` : Text
  - `misc` : Everything Else

So, in order to create a field which could upload an image, the syntax would be:

    <div class="form_row">
        <div class="full image file_attachment field_container">
            <label for="MNEMONIC">Image URL</label>
            <input type="text" id="MNEMONIC" readonly>
        </div>
    </div>

Like the validated table fields, all of the icons will be handled by `dataentry/frontend.js`.

The final field that's kind of related to a validated table field is a **browse field**.  A browse field is used for fields like `Entered By` on the "New Acquisitions" worksheet for the Collections database.  Regardless of the size of the field (and sibling fields), the form row containing the browse field must also have a class of `contains_browse`, which is used for JavaScript scoping reasons.  The way you set up the browse field container is by adding the `validated_table` class to the `field_container`, as well as specifying which database to browse (in this case, `VAL_USER`) into the `data-val-database` attribute of the input element, as well as specifying the field to browse by using the `data-val-field` attribute, like this:
    
    <div class="form_row contains_browse">
        <div class="full validated_table field_container">
            <label for="ENTERED_BY">Entered By</label>
            <input type="text" id="ENTERED_BY" data-val-database="VAL_USER" data-val-field="EXPANSION" readonly>
        </div>
    </div>

Like the validated table and file upload fields, you'll want to add the `readonly` attribute to the input element as well to force the user to use the browse functionality.

OK, so you're familiar with the different types of fields you can use in the M2A Online application, but you've surely seen other types of data organization as well.  Well, let me introduce you to **groups**.

There are *two* types of groups.  A **logical group** is purely presentational, and has no reflection on the database whatsoever.  If you were so inclined, you could put every group of 3 fields inside of a logical group if you wanted without having to do anything to the database.  It would look stupid, but you could do it.  Logical groups are setup using the `<fieldset>` element with a class of `logical_group`.  The label is added using the related `<legend>` element.  So, to set up a logical group, use the following syntax:

    <fieldset class="logical_group">
      <legend>Logical Group</legend>

      <div class="borderless form_row">
        <div class="field_container">
          <label for="MNEMONIC">Mnemonic</label>
          <input type="text" id="MNEMONIC">
        </div>
      </div>
    </fieldset>

The second type of group you're going to use quite a bit more, the **repeating group**.  Unlike a logical group, the repeating group *doesn't* use a legend to determine its title, and there are a couple of more attributes you'll need to add to the fieldset to make it work.  First, in place of a legend, you'll enter in the `data-group-title` attribute for displaying a group's title.  Second, unlike a logical group, a repeating group *needs* an `id` attribute.  This should be equal to the group's ID in the database, as this attribute is what's going to tell the application where to load in that group's fields.  So, with that being said, here's the syntax for setting up a repeating group:

    <fieldset class="repeating_group" data-group-title="Group Title" id="GROUP_ID">
        <div class="form_row">
            <div class="medium field_container">
                <label for="MNEMONIC">Mnemonic</label>
                <input type="text" id="MNEMONIC">
            </div>
            <div class="medium field_container">
                <label for="MNEMONIC">Mnemonic</label>
                <input type="text" id="MNEMONIC">
            </div>
        </div>

        <div class="borderless form_row">
            <div class="full field_container">
                <label for="MNEMONIC_2">Another Mnemonic</label>
                <input type="text" id="MNEMONIC_2">
            </div>
        </div>
    </fieldset>

`dataentry/frontend.js` will take care of handling the buttons to pick previous/next occurrences, as well as displaying current/total occurrence counts.  That's really all there is to creating a repeating group!


-----------------------------------


# Part 3:  Behavioural Stuff
