#Initially used to generate posts for my shader

import json
import urllib.request
from datetime import datetime

KEY = " "

def generate_post(shader_id):
    shader = json.loads(urllib.request.urlopen("https://www.shadertoy.com/api/v1/shaders/%s?key=%s" % (shader_id, KEY)).read())["Shader"]["info"]
    converted_date = (datetime.fromtimestamp(int(shader["date"])))
    filename_date = converted_date.strftime("%Y-%d-%m-%H-%M-%S")
    converted_tags = " ".join(shader["tags"])

    front_matter = """---
title:  "{title}"
thumbnail: "https://www.shadertoy.com/media/shaders/{id}.jpg"
description: "{description}"
date: {date}
categories: visual shader glsl {tags}
shadertoy_id: "{id}" 
layout: shadertoy
---
""".format(title=shader["name"], description=shader["description"], date=converted_date, id=shader["id"], tags=converted_tags)
    filename = "-".join([filename_date, "-".join(shader["name"].lower().split(" "))]) + ".markdown"
    print(filename)
    #2019-02-19- welcome-to- jekyll
    print(front_matter)

    out_file = open("posts/" + filename, 'w')
    out_file.write(front_matter)
    out_file.close()

shader_list = json.loads(urllib.request.urlopen("https://www.shadertoy.com/api/v1/shaders/query/blokatt?key=%s" % (KEY)).read())

for shader in shader_list["Results"]:
    generate_post(shader)
