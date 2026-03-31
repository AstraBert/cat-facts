use anyhow::{anyhow, Result};
use serde::{Deserialize, Serialize};
use strum_macros::{Display, EnumString};

const MEOW_FACT_URL: &str = "https://meowfacts.herokuapp.com/";
const CATAAS_URL: &str = "https://cataas.com/cat";

#[derive(EnumString, Display)]
enum Language {
    #[strum(serialize = "eng")]
    English,
    #[strum(serialize = "ces")]
    Czech,
    #[strum(serialize = "ger")]
    German,
    #[strum(serialize = "ben")]
    Bengali,
    #[strum(serialize = "esp")]
    Spanish,
    #[strum(serialize = "rus")]
    Russian,
    #[strum(serialize = "por")]
    Portuguese,
    #[strum(serialize = "fil")]
    Filipino,
    #[strum(serialize = "ukr")]
    Ukranian,
    #[strum(serialize = "urd")]
    Urdu,
    #[strum(serialize = "ita")]
    Italian,
    #[strum(serialize = "zho")]
    Chinese,
    #[strum(serialize = "kor")]
    Korean,
}

fn is_supported_language(lang: &str) -> bool {
    match lang.parse::<Language>() {
        Ok(_) => true,
        Err(_) => false,
    }
}

#[derive(Serialize, Deserialize)]
pub struct MeowFact {
    data: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct CatPicture {
    url: String,
}

pub async fn get_cat_fact(lang: &str) -> Result<String> {
    if !is_supported_language(lang) {
        println!("Invalid language!");
        return Err(anyhow!("Language not supported"));
    }
    let client = reqwest::Client::new();
    let body = client
        .get(MEOW_FACT_URL)
        .query(&[("lang", lang)])
        .send()
        .await?
        .json::<MeowFact>()
        .await?;

    if body.data.is_empty() {
        println!("No cat fact");
        return Err(anyhow!("No cat fact was found at this time :("));
    }

    Ok(body.data[0].to_owned())
}

pub async fn get_random_cat_picture() -> Result<String> {
    let client = reqwest::Client::new();
    let body = client
        .get(CATAAS_URL)
        .query(&[("json", "true"), ("type", "square")])
        .send()
        .await?
        .json::<CatPicture>()
        .await?;

    Ok(body.url)
}
