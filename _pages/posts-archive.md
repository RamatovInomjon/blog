---
title: "Barcha postlar"
layout: archive
permalink: /posts/
author_profile: true
---

{% assign postsByYear = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}

{% for year in postsByYear %}
  <section class="taxonomy__section">
    <h2 class="archive__subtitle">{{ year.name }}</h2>
    <div class="entries-list">
      {% for post in year.items %}
        {% include archive-single.html %}
      {% endfor %}
    </div>
  </section>
{% endfor %}
