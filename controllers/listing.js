const Listing = require("../models/listing");

module.exports.index = async (req, res)=>{
    const allListing = await Listing.find({});
    //console.log(allListing);
    res.render("listings/index.ejs",{ allListing });
};

module.exports.rendernewform = (req, res)=>{
    res.render("listings/new.ejs");
};


module.exports.showlisting = async (req, res)=>{
    let { id } = req.params;
    const listingc = await Listing.findById(id).populate(
        { path: "reviews",
          populate: { path: "author", },

        }).populate("owner");
    if(!listingc){
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{ listingc });


};


module.exports.createlisting = async (req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = Listing(req.body.Listings);
    newlisting.owner = req.user._id;
    //console.log(listings);
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect("/listings");
};


module.exports.rendereditform = async (req ,res)=>{
    let { id } = req.params;
    const listingc = await Listing.findById(id);
    if(!listingc){
        req.flash("error","Listing you requested for does not exits!");
        res.redirect("/listings");
    }
    let originalimageurl = listingc.image.url;
    originalimageurl = originalimageurl.replace("/upload","/upload/w_300");

    res.render("listings/edit.ejs",{ listingc, originalimageurl });
};


module.exports.updatelisting = async (req, res)=>{
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.Listings);

    if(typeof req.file  !== "undefined" ){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();

    }
    
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${ id }`);

};

module.exports.deletelisting = async (req, res)=>{
    let { id } = req.params;
    let listingcc = await Listing.findByIdAndDelete(id);
    console.log(listingcc);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");

};