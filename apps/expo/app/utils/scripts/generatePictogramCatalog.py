import json

with open('../../../assets/dictionaries/Dizionario_it.json', encoding="utf8") as user_file:
  parsed_json = json.load(user_file)

f = open("../pictograms.ts", "w")
f.write("const pictograms = {\n")
for entry in parsed_json:
  f.write(f"\t{entry['_id']}: require(\"../../assets/pictograms/img_{entry['_id']}.png\"),\n")
f.write("}\nexport default pictograms;")