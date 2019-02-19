require "jekyll-import";

JekyllImport::Importers::Tumblr.run({
    "url"            => "https://me.blokatt.net",
    "format"         => "html", # "md" misses links and images etc
    "grab_images"    => true,
    "add_highlights" => false,
    "rewrite_urls"   => false # `true` breaks build
})