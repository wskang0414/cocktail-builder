from bs4 import BeautifulSoup
import requests
import json

# source website
html_text = requests.get(
    'https://uk.thebar.com/cocktail-recipes?seeAll=true').text

soup = BeautifulSoup(html_text, 'lxml')
drinks = soup.find_all('article', class_='recipe-tile')
parsed = []


def find_ingredients():
    ing_list = []
    ing_map = {}
    count = 0

    with open('data.json', 'w', encoding='utf-8') as jsonFile:
        # loop through the page to create a list of cocktail names
        for drink in drinks:
            drink_title = drink.find('h3').get_text().strip()
            image = drink.find('img', src=True)
            image_link = image['src']

            # unique link for each type
            sublink = drink.find('a', href=True)
            link = 'https://uk.thebar.com' + sublink['href']

            inside_text = requests.get(link).text

            soup = BeautifulSoup(inside_text, 'lxml')
            table = soup.find('ul', class_='instruction-item-list')

            try:
                ingredients = table.find_all('li', class_=False)
            except:
                ing_list.append("None")
                continue

            for ingredient in ingredients:
                try:
                    ing_title = ingredient.find(
                        'div', class_='instruction-item-list-detail')
                except:
                    ing_title = "None"

                ing_list.append(ing_title.get_text().strip())

            ing_map["Cocktail"] = drink_title
            ing_map["Ingredients"] = ing_list
            ing_map["Image"] = image_link
            ing_map["Num"] = count

            count += 1

            jsonStr = json.dumps(ing_map, ensure_ascii=False).encode('utf-8')
            parsed.append(jsonStr.decode('utf-8'))

            ing_list.clear()
            ing_map.clear()

        jsonFile.write(str(parsed))
        jsonFile.close()


if __name__ == '__main__':
    find_ingredients()
